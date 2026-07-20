import { ValidRoleNames } from "src/modules/roles/enum/role-validate.enum";
import { ValidProfileNames } from "src/modules/users/enums/profiles.enum";

export interface Payload {
    sub?: string;
    id: string;
    email: string,
    role_name: ValidRoleNames,
    wallet_id?: string,
    cart_id?: string,
    profiles?: ValidProfileNames[]
}