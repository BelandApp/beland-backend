# ADR-006: Backend Module Organization

**Estado:** Accepted

**Fecha:** 2026-07-17

---

# Contexto

Durante la migración del dominio financiero se detectó que gran parte de la complejidad provenía de una mezcla de responsabilidades dentro de los módulos del backend.

Era frecuente encontrar:

- Lógica de negocio dentro de Services.
- Validaciones de negocio mezcladas con Controllers.
- Reglas de autorización embebidas en distintos puntos del dominio.
- Operaciones financieras distribuidas entre múltiples clases.

La adopción del patrón basado en **Application Services + UseCases + Domain Services** permitió reducir el acoplamiento, mejorar la reutilización, simplificar las auditorías y facilitar el mantenimiento del sistema.

Con el objetivo de mantener esa consistencia en todos los módulos del backend, se define una estructura estándar de organización y responsabilidades.

---

# Decisión

Todo módulo del backend deberá respetar la siguiente estructura mínima:

```text
module/

├── controllers/
├── dtos/
├── entities/
├── enums/
├── policies/
├── services/
├── use-cases/
└── module.module.ts
```

Esta estructura establece una separación clara entre la capa de transporte, la orquestación del módulo, la lógica de negocio y las reglas particulares del dominio.

---

# Responsabilidades

## controllers/

Representan la capa HTTP del módulo.

Responsabilidades:

- Definir rutas.
- Aplicar Guards y Decoradores.
- Validar DTOs.
- Transformar respuestas cuando sea necesario.
- Delegar la ejecución al Service correspondiente.

No deben contener:

- Lógica de negocio.
- Acceso directo a persistencia.
- Reglas financieras.
- Reglas específicas del dominio.

---

## services/

Los Services representan **Application Services**.

Responsabilidades:

- Orquestar el flujo del módulo.
- Abrir transacciones cuando corresponda.
- Resolver dependencias entre módulos.
- Invocar los UseCases.
- Ejecutar efectos secundarios (emails, sockets, webhooks, notificaciones) únicamente después de una transacción exitosa.

No deben contener reglas de negocio.

---

## use-cases/

Representan los casos de uso del dominio.

Responsabilidades:

- Implementar la lógica de negocio.
- Ejecutar validaciones del dominio.
- Modificar entidades.
- Coordinar Domain Services.
- Reutilizar componentes compartidos (por ejemplo WalletPaymentService).

Toda operación crítica del negocio deberá implementarse en esta capa.

---

## policies/

Las Policies encapsulan reglas reutilizables específicas del módulo.

Ejemplos:

- Autorizaciones propias del dominio.
- Restricciones funcionales.
- Límites de negocio.
- Validaciones reutilizables.
- Reglas de elegibilidad.

Las Policies no reemplazan Guards ni Decoradores de autenticación.

Los Guards controlan el acceso.

Las Policies determinan si una operación del dominio puede ejecutarse.

---

## dtos/

Objetos de transferencia de datos.

No deben contener lógica de negocio.

---

## entities/

Entidades persistentes del dominio.

Representan el modelo de datos.

No deben contener lógica de aplicación.

---

## enums/

Enumeraciones compartidas por el módulo.

---

# Extensiones futuras

Cuando la complejidad del módulo lo justifique podrán incorporarse nuevas carpetas manteniendo esta estructura como base.

Ejemplo:

```text
repositories/
```

Los Repositories encapsularán el acceso a persistencia cuando existan consultas complejas o cuando se requiera desacoplar los UseCases del ORM.

Su incorporación será progresiva y no forma parte del presente ADR.

---

# Reglas arquitectónicas

Todos los módulos deberán cumplir las siguientes reglas:

- Los Controllers nunca contienen lógica de negocio.
- Los Services actúan únicamente como Application Services.
- Los UseCases son los únicos responsables de implementar lógica de negocio.
- Las Policies encapsulan reglas reutilizables propias del dominio.
- Las transacciones deberán iniciarse desde los Application Services y propagarse utilizando EntityManager.
- Los efectos secundarios (emails, sockets, webhooks y notificaciones) deberán ejecutarse únicamente después de que la transacción haya finalizado exitosamente.

---

# Consecuencias

## Beneficios

- Separación clara de responsabilidades.
- Reducción del acoplamiento.
- Mayor reutilización.
- UseCases pequeños y fácilmente testeables.
- Auditorías arquitectónicas más simples.
- Homogeneidad entre todos los módulos del backend.

## Costos

- Mayor cantidad de clases.
- Mayor disciplina arquitectónica.
- Ligero incremento del trabajo inicial al crear nuevos módulos.

---

# Estado

Accepted.

Este ADR establece la organización estándar que deberán seguir todos los módulos nuevos y aquellos que sean migrados progresivamente durante la evolución del backend.