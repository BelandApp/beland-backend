// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
  InternalServerErrorException,
  Inject, // Importar Inject
  forwardRef, // Importar forwardRef
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RolesRepository } from '../roles/roles.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { Role } from '../roles/entities/role.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderDto } from 'src/common/dto/order.dto';
import { UserDto } from './dto/user.dto';
import { DataSource, Not, IsNull, Or, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { ValidRoleNames } from 'src/modules/roles/enum/role-validate.enum';
import { Auth0LoginDto } from './dto/auth0-login.dto'; // Importar el nuevo DTO
import { AuthService } from '../auth/auth.service'; // Importar AuthService
const QRCode = require('qrcode'); // Importar qrcode aquí para que esté disponible en el contexto
import { UserEventBeland } from './entities/users-event-beland.entity';

// Constantes para los nombres de roles
const ROLE_USER = 'USER';
const ROLE_LEADER = 'LEADER';
const ROLE_ADMIN = 'ADMIN';
const ROLE_SUPERADMIN = 'SUPERADMIN';
const ROLE_COMMERCE = 'COMMERCE';
const ROLE_FUNDATION = 'FUNDATION';

// // Definición de tipo para todos los roles válidos
// type ValidRoleNames =
//   | 'USER'
//   | 'LEADER'
//   | 'ADMIN'
//   | 'SUPERADMIN'
//   | 'COMMERCE'
//   | 'FUNDATION';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private dataSource: DataSource,
    @Inject(forwardRef(() => AuthService)) // Inyectar AuthService con forwardRef
    private readonly authService: AuthService,
  ) {}

  // ==============================================
  //           *** MÉTODO PARA AUTH0 ***
  // ==============================================

  /**
   * Busca un usuario por su ID de Auth0 o lo crea si no existe.
   * Este método es llamado por JwtStrategy para manejar el aprovisionamiento de usuarios de Auth0,
   * y por la nueva ruta pública '/users/auth0-login'.
   *
   * @param auth0LoginDto Contiene los datos del usuario de Auth0, incluyendo `auth0_id`.
   * @returns Un objeto con la entidad `User` de la base de datos y un token JWT.
   * @throws InternalServerErrorException si hay un error en la base de datos.
   * @throws ConflictException si el email ya está en uso por un usuario no-Auth0.
   */
  async findOrCreateAuth0User(
    auth0LoginDto: Auth0LoginDto,
  ): Promise<{ user: User; token: string }> {
    this.logger.debug(
      `findOrCreateAuth0User(): Procesando usuario con Auth0 ID: ${
        auth0LoginDto.auth0_id || 'N/A'
      } y email: ${auth0LoginDto.email}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let user: User | null = null; // Inicializar user como null, se buscará primero por email

      // 1. Intentar encontrar el usuario por email (siempre debería estar presente)
      if (auth0LoginDto.email) {
        user = await this.usersRepository.findByEmail(auth0LoginDto.email);
      }

      // 2. Si se encontró un usuario por email, manejar vinculación o conflicto
      if (user) {
        this.logger.debug(
          `findOrCreateAuth0User(): Usuario existente encontrado por email: ${user.email}. ID: ${user.id}.`,
        );

        if (!user.auth0_id && auth0LoginDto.auth0_id) {
          // Si el usuario existe por email pero no tiene auth0_id, vincularlo con el auth0_id actual
          user.auth0_id = auth0LoginDto.auth0_id;
          user.oauth_provider =
            auth0LoginDto.oauth_provider || user.oauth_provider;
          await queryRunner.manager.save(User, user);
          this.logger.log(
            `findOrCreateAuth0User(): Usuario existente por email (${user.email}) vinculado a Auth0 ID: ${auth0LoginDto.auth0_id}.`,
          );
        } else if (
          user.auth0_id &&
          auth0LoginDto.auth0_id &&
          user.auth0_id !== auth0LoginDto.auth0_id
        ) {
          // Si ya existe y tiene un auth0_id diferente al que viene en el DTO, es un conflicto grave.
          this.logger.warn(
            `findOrCreateAuth0User(): Conflicto de Auth0 ID para email "${auth0LoginDto.email}": existente "${user.auth0_id}", nuevo "${auth0LoginDto.auth0_id}".`,
          );
          throw new ConflictException(
            `El email "${auth0LoginDto.email}" ya está registrado y vinculado a otra cuenta de Auth0.`,
          );
        }
        // Si el usuario existe por email y tiene auth0_id (y coincide con el del DTO o el DTO no trae uno),
        // o si el DTO no trae auth0_id para vincular, simplemente usamos el usuario existente.
      } else {
        // 3. Si no se encontró por email, y Auth0 ID está presente, intentar buscar por Auth0 ID (raro si email es obligatorio)
        if (auth0LoginDto.auth0_id && auth0LoginDto.auth0_id.trim() !== '') {
          user = await this.usersRepository.findByAuth0Id(
            auth0LoginDto.auth0_id,
          );
          if (user) {
            this.logger.debug(
              `findOrCreateAuth0User(): Usuario existente encontrado por Auth0 ID: ${user.auth0_id}. Email: ${user.email}.`,
            );
            // Actualizar email si es diferente (Auth0 es la fuente de verdad)
            if (user.email !== auth0LoginDto.email) {
              user.email = auth0LoginDto.email;
              await queryRunner.manager.save(User, user);
              this.logger.log(
                `findOrCreateAuth0User(): Email de usuario Auth0 ID ${user.auth0_id} actualizado a ${user.email}.`,
              );
            }
          }
        }
      }

      if (user) {
        // Actualizar datos del usuario existente con información de Auth0
        user.full_name = auth0LoginDto.full_name || user.full_name;
        user.profile_picture_url =
          auth0LoginDto.profile_picture_url || user.profile_picture_url;
        user.oauth_provider =
          auth0LoginDto.oauth_provider || user.oauth_provider;
        user.auth0_id = auth0LoginDto.auth0_id || user.auth0_id; // Actualizar auth0_id si se proporciona
        await queryRunner.manager.save(User, user);

        // Asegurarse de que las relaciones necesarias (ej. rol) estén cargadas para los guards.
        user = await this.usersRepository.findOne(user.id);
        const { token } = await this.authService.createToken(user); // Generar JWT local
        await queryRunner.commitTransaction(); // Confirma la transacción para usuario existente
        return { user, token };
      }

      // Si no se encontró ningún usuario por email ni Auth0 ID, se crea uno nuevo
      this.logger.debug(
        `findOrCreateAuth0User(): Creando nuevo usuario para email: ${auth0LoginDto.email}`,
      );

      let defaultRole = await this.rolesRepository.findByName(ROLE_USER);
      if (!defaultRole) {
        defaultRole = await queryRunner.manager.save(Role, {
          name: ROLE_USER,
          description: 'Usuario básico del sistema',
          is_active: true,
        });
        this.logger.warn(
          `findOrCreateAuth0User(): El rol '${ROLE_USER}' no existía, fue creado.`,
        );
      }

      // Generar una contraseña aleatoria y hasheada (Auth0 maneja la autenticación externa,
      // pero una contraseña es necesaria para la integridad del modelo User si no es nullable)
      const randomPassword =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        '!A1';
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newUser = queryRunner.manager.create(User, {
        auth0_id: auth0LoginDto.auth0_id || null, // auth0_id puede ser null
        email: auth0LoginDto.email, // Email siempre presente
        full_name: auth0LoginDto.full_name,
        profile_picture_url: auth0LoginDto.profile_picture_url,
        oauth_provider: auth0LoginDto.oauth_provider,
        role_name: defaultRole.name,
        role_id: defaultRole.role_id,
        password: hashedPassword, // Asignar contraseña hasheada
        isBlocked: false,
        deleted_at: null,
      });

      const savedUser = await queryRunner.manager.save(User, newUser);

      // Crear cartera y carrito por defecto para el nuevo usuario
      await this.authService.createWalletAndCart(queryRunner, savedUser); // Usar el método del AuthService

      await queryRunner.commitTransaction(); // Confirma la transacción para el nuevo usuario

      // Retornar el usuario recién creado, asegurando que las relaciones estén cargadas
      user = await this.usersRepository.findOne(savedUser.id);
      const { token } = await this.authService.createToken(user); // Generar JWT local
      return { user, token };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `findOrCreateAuth0User(): Error al crear/recuperar usuario para Auth0 ID ${
          auth0LoginDto.auth0_id || 'N/A'
        } o email ${auth0LoginDto.email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to provision or retrieve user during Auth0 login.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // ==============================================
  //           *** MÉTODOS EXISTENTES ***
  // ==============================================

  /**
   * Busca todos los usuarios paginados, filtrados y ordenados.
   * @param getUsersQueryDto Objeto DTO con parámetros de paginación, filtro y ordenación.
   * @param isSuperAdminOrAdmin Booleano que indica si el usuario actual es un Superadmin o Admin.
   * @returns Una promesa que resuelve a un objeto con la lista de UserDto y el total.
   */
  async findAll(
    getUsersQueryDto: GetUsersQueryDto,
    isSuperAdminOrAdmin: boolean,
  ): Promise<{ users: UserDto[]; total: number }> {
    this.logger.debug(
      `findAll(): Buscando usuarios con filtros: ${JSON.stringify(
        getUsersQueryDto,
      )} con isSuperAdminOrAdmin: ${isSuperAdminOrAdmin}`,
    );

    const finalIncludeDeleted = isSuperAdminOrAdmin
      ? getUsersQueryDto.includeDeleted
      : false;

    getUsersQueryDto.includeDeleted = finalIncludeDeleted;

    const { users, total } = await this.usersRepository.findAllPaginated(
      getUsersQueryDto,
    );

    const usersDto = plainToInstance(UserDto, users);
    return { users: usersDto, total };
  }

  // async getUsersEventBeland(): Promise<UserEventBeland[]> {
  //   const userEvent = this.dataSource.getRepository(UserEventBeland);

  //   return await userEvent.find();
  // }

  /**
   * Busca un usuario por su ID.
   * @param id El ID del usuario.
   * @param includeDeleted Si se deben incluir usuarios desactivados.
   * @returns Una promesa que resuelve al UserDto o lanza NotFoundException.
   * @throws NotFoundException Si el usuario no se encuentra.
   */
  async findOneById(
    id: string,
    includeDeleted: boolean = false,
  ): Promise<UserDto> {
    this.logger.debug(`findOneById(): Buscando usuario con ID: ${id}`);
    const user = await this.usersRepository.findOne(id, includeDeleted);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return plainToInstance(UserDto, user);
  }

  /**
   * Busca un usuario por su email.
   * @param email El email del usuario.
   * @returns Una promesa que resuelve a la entidad User o lanza NotFoundException.
   */
  async findUserEntityByEmail(email: string): Promise<User> {
    this.logger.debug(
      `findUserEntityByEmail(): Buscando usuario con email: ${email}`,
    );
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        `Usuario con email "${email}" no encontrado.`,
      );
    }
    return user;
  }

  /**
   * Busca un usuario por su nombre de usuario.
   * @param username El nombre de usuario.
   * @returns Una promesa que resuelve a la entidad User o lanza NotFoundException.
   */
  async findUserEntityByUsername(username: string): Promise<User> {
    this.logger.debug(
      `findUserEntityByUsername(): Buscando usuario con username: ${username}`,
    );
    const user = await this.usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException(
        `Usuario con username "${username}" no encontrado.`,
      );
    }
    return user;
  }

  /**
   * Busca un usuario por su número de teléfono.
   * @param phone El número de teléfono.
   * @returns Una promesa que resuelve a la entidad User o lanza NotFoundException.
   */
  async findUserEntityByPhone(phone: string): Promise<User> {
    this.logger.debug(
      `findUserEntityByPhone(): Buscando usuario con teléfono: ${phone}`,
    );
    const user = await this.usersRepository.findByPhone(phone);
    if (!user) {
      throw new NotFoundException(
        `Usuario con teléfono "${phone}" no encontrado.`,
      );
    }
    return user;
  }

  /**
   * Busca un usuario por su ID y devuelve la entidad User.
   * Este método es para uso interno cuando se necesita la entidad completa,
   * por ejemplo, para realizar comprobaciones de roles/estados.
   * @param id El ID del usuario.
   * @returns Una promesa que resuelve a la entidad User o lanza NotFoundException.
   * @throws NotFoundException Si el usuario no se encuentra.
   */
  async findUserEntityById(id: string): Promise<User> {
    this.logger.debug(
      `findUserEntityById(): Buscando entidad usuario con ID: ${id}`,
    );
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return user;
  }

  /**
   * Comprueba si un usuario es un administrador o superadministrador.
   * @param userId El ID del usuario a verificar.
   * @returns `true` si el usuario es un ADMIN o SUPERADMIN, `false` en caso contrario.
   */
  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne(userId);
    return (
      user?.role_name === ROLE_ADMIN || user?.role_name === ROLE_SUPERADMIN
    );
  }

  /**
   * Busca usuarios desactivados lógicamente (soft-deleted).
   * @returns Una lista de entidades User desactivadas.
   */
  async findDeactivatedUsers(): Promise<UserDto[]> {
    this.logger.debug(
      'findDeactivatedUsers(): Buscando usuarios desactivados.',
    );
    const users = await this.usersRepository.findDeactivatedUsers();
    return plainToInstance(UserDto, users);
  }

  // MÉTODOS DE CREACIÓN/ACTUALIZACIÓN/ELIMINACIÓN

  /**
   * Crea un nuevo usuario.
   * Este método DEBE tener validaciones adicionales para la unicidad de email/username.
   * @param createUserDto Datos para crear el usuario.
   * @returns Una promesa que resuelve al UserDto del usuario creado.
   * @throws ConflictException si el email o username ya existen.
   */
  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    this.logger.debug(
      `create(): Intentando crear nuevo usuario: ${createUserDto.email}`,
    );

    const existingUserByEmail = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException(
        `El email "${createUserDto.email}" ya está registrado.`,
      );
    }

    if (createUserDto.username) {
      const existingUserByUsername = await this.usersRepository.findByUsername(
        createUserDto.username,
      );
      if (existingUserByUsername) {
        throw new ConflictException(
          `El nombre de usuario "${createUserDto.username}" ya está en uso.`,
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let userRole = await this.rolesRepository.findByName(ROLE_USER);

      if (!userRole) {
        userRole = await queryRunner.manager.save(Role, {
          name: ROLE_USER,
          description: 'Usuario básico del sistema',
          is_active: true,
        });
        this.logger.warn(`El rol 'USER' no existía, fue creado.`);
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = queryRunner.manager.create(User, {
        ...createUserDto,
        password: hashedPassword,
        role_name: userRole.name as ValidRoleNames,
        role_id: userRole.role_id,
      });

      const savedUser = await queryRunner.manager.save(User, newUser);

      const newWallet = queryRunner.manager.create(Wallet, {
        user: savedUser,
        balance: 0,
      });
      await queryRunner.manager.save(Wallet, newWallet);

      const newCart = queryRunner.manager.create(Cart, { user: savedUser });
      await queryRunner.manager.save(Cart, newCart);

      await queryRunner.commitTransaction();

      this.logger.log(
        `create(): Usuario ${savedUser.email} creado exitosamente.`,
      );
      return plainToInstance(UserDto, savedUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `create(): Error al crear usuario: ${(error as Error).message}`,
        (error as Error).stack,
      );
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'No se pudo registrar el usuario.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserCommerce(
    userId: string,
    roleName: ValidRoleNames,
  ): Promise<Omit<User, 'password'>> {
    const role = await this.dataSource.getRepository(Role).findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new BadRequestException(`El rol "${roleName}" no existe.`);
    }

    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    if (user.role.name !== 'USER') {
      throw new BadRequestException(
        `El rol actual de usuario no le permite usar esta opción`,
      );
    }

    user.role_name = role.name;
    user.role_id = role.role_id;
    const userUpdate: User = await userRepo.save(user);

    const { password, ...safeUser } = userUpdate;
    return safeUser;
  }

  async updateRolToSuperadmin(
    userId: string,
    userRole: ValidRoleNames,
  ): Promise<Omit<User, 'password'>> {
    const role = await this.dataSource.getRepository(Role).findOne({
      where: { name: userRole },
    });

    if (!role) {
      throw new BadRequestException(`El rol ${userRole} no existe.`);
    }
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    user.role_name = role.name;
    user.role_id = role.role_id;
    const userResult = await userRepo.save(user);

    const { password, ...safeUser } = userResult;
    return safeUser;
  }

  /**
   * Actualiza un usuario existente por su ID.
   * @param id El ID del usuario a actualizar.
   * @param updateUserDto Objeto DTO con las propiedades a actualizar.
   * @returns Una promesa que resuelve al UserDto del usuario actualizado.
   * @throws NotFoundException si el usuario no se encuentra.
   * @throws ConflictException si el nuevo email o username ya existen.
   * @throws BadRequestException si se intenta actualizar el rol de un superadmin o si el rol no es válido.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    this.logger.debug(`update(): Actualizando usuario con ID: ${id}`);
    const userToUpdate = await this.usersRepository.findOne(id);
    if (!userToUpdate) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUser = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          `El email "${updateUserDto.email}" ya está en uso por otro usuario.`,
        );
      }
    }

    if (
      updateUserDto.username &&
      updateUserDto.username !== userToUpdate.username
    ) {
      const existingUser = await this.usersRepository.findByUsername(
        updateUserDto.username,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          `El nombre de usuario "${updateUserDto.username}" ya está en uso por otro usuario.`,
        );
      }
    }

    if (updateUserDto.password) {
      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden.');
      }
      userToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.role) {
      if (
        userToUpdate.role_name === ROLE_SUPERADMIN &&
        updateUserDto.role !== ROLE_SUPERADMIN
      ) {
        throw new BadRequestException(
          'No se puede cambiar el rol de un SUPERADMIN.',
        );
      }

      const newRole = await this.rolesRepository.findByName(updateUserDto.role);
      if (!newRole) {
        throw new BadRequestException(
          `El rol "${updateUserDto.role}" no es un rol válido.`,
        );
      }
      userToUpdate.role_name = newRole.name as ValidRoleNames;
      userToUpdate.role_id = newRole.role_id;
    }

    Object.assign(userToUpdate, updateUserDto);

    const updatedUser = await this.usersRepository.save(userToUpdate);
    this.logger.log(`update(): Usuario ${id} actualizado exitosamente.`);
    return plainToInstance(UserDto, updatedUser);
  }

  /**
   * Actualiza el estado de bloqueo de un usuario.
   * @param id El ID del usuario.
   * @param isBlocked El nuevo estado de bloqueo.
   * @returns Una promesa que resuelve al UserDto del usuario actualizado.
   * @throws NotFoundException si el usuario no se encuentra.
   * @throws BadRequestException si se intenta bloquear a un SUPERADMIN.
   */
  async updateBlockStatus(id: string, isBlocked: boolean): Promise<UserDto> {
    this.logger.debug(
      `updateBlockStatus(): Actualizando estado de bloqueo para ID: ${id} a ${isBlocked}`,
    );
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    if (user.role_name === ROLE_SUPERADMIN) {
      throw new BadRequestException(
        'No se puede bloquear o desbloquear a un SUPERADMIN.',
      );
    }

    user.isBlocked = isBlocked;
    const updatedUser = await this.usersRepository.save(user);
    this.logger.log(
      `updateBlockStatus(): Usuario ${id} estado de bloqueo actualizado a ${isBlocked}.`,
    );
    return plainToInstance(UserDto, updatedUser);
  }

  /**
   * Desactiva lógicamente un usuario (soft delete).
   * @param id El ID del usuario a desactivar.
   * @throws NotFoundException si el usuario no se encuentra.
   * @throws BadRequestException si el usuario ya está desactivado o es un SUPERADMIN.
   */
  async softDeleteUser(id: string): Promise<void> {
    this.logger.debug(`softDeleteUser(): Desactivando usuario con ID: ${id}.`);
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    if (user.deleted_at !== null) {
      throw new BadRequestException(
        `El usuario con ID "${id}" ya está desactivado.`,
      );
    }
    if (user.role_name === ROLE_SUPERADMIN) {
      throw new BadRequestException('No se puede desactivar a un SUPERADMIN.');
    }

    await this.usersRepository.softDelete(id);
    this.logger.log(
      `softDeleteUser(): Usuario ${id} desactivado exitosamente.`,
    );
  }

  /**
   * Reactiva un usuario previamente desactivado. Devuelve UserDto.
   * @param id El ID del usuario a reactivar.
   * @returns El UserDto reactivado.
   * @throws NotFoundException si el usuario no se encuentra.
   * @throws BadRequestException si el usuario ya está activo.
   */
  async reactivateUser(id: string): Promise<UserDto> {
    this.logger.debug(`reactivateUser(): Reactivando usuario con ID: ${id}.`);
    const user = await this.usersRepository.findOne(id, true);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    if (user.deleted_at === null) {
      throw new BadRequestException(
        `El usuario con ID "${id}" ya está activo.`,
      );
    }

    await this.usersRepository.reactivate(id);
    this.logger.log(`reactivateUser(): Usuario ${id} reactivado exitosamente.`);
    const reactivatedUser = await this.usersRepository.findOne(id);
    return plainToInstance(UserDto, reactivatedUser);
  }

  /**
   * Elimina permanentemente un usuario de la base de datos (hard delete).
   * @param id El ID del usuario a eliminar.
   * @throws NotFoundException si el usuario no se encuentra.
   * @throws BadRequestException si se intenta eliminar un SUPERADMIN.
   * @returns void
   */
  async deleteUser(id: string): Promise<void> {
    this.logger.debug(`deleteUser(): Eliminando usuario con ID: ${id}.`);
    const user = await this.usersRepository.findOne(id, true);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    if (user.role_name === ROLE_SUPERADMIN) {
      throw new BadRequestException(
        'No se puede eliminar a un SUPERADMIN permanentemente.',
      );
    }

    await this.usersRepository.softDelete(id);
    this.logger.log(`deleteUser(): Usuario ${id} eliminado permanentemente.`);
  }
}
