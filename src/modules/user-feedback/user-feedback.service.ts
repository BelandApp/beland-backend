import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserFeedbackRepository } from './user-feedback.repository';
import { UserFeedback } from './entities/user-feedback.entity';
import { FindAllFilters } from './dto/find-all-filter.dto';

@Injectable()
export class UserFeedbackService {
  private readonly completeMessage = 'el feedback de usuario';

  constructor(private readonly repository: UserFeedbackRepository) {}

  async findAllUser(
    user_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[UserFeedback[], number]> {
    try {
      const response = await this.repository.findAllUser(
        user_id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(filters: FindAllFilters): Promise<{ data: UserFeedback[]; total: number }> {
    return this.repository.findAllWithFilters(filters);
  }

  async findOne(id: string): Promise<UserFeedback> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<UserFeedback>): Promise<UserFeedback> {
    try {
      const res = await this.repository.create(body);
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<UserFeedback>) {
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new ConflictException(`No se puede eliminar ${this.completeMessage}`);
    }
  }
}
