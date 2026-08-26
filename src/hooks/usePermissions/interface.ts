import { IUser, UserLevel } from "@/Interfaces/User/user";
import {
  AccessCriteria,
  PermissionAction,
  PermissionCode,
  PermissionMatchMode,
} from "@/Interfaces/ProfilePermissions/profilePermissions";

export interface UsePermissionsReturn {
  user: IUser;
  /** Códigos de permissão do usuário logado. */
  permissions: PermissionCode[];
  /** Feature flags ativas. */
  features: string[];
  level?: UserLevel;
  /** Sessão ainda sendo validada — trate como "sem permissão" até resolver. */
  isLoading: boolean;
  /** `acesso_total` da API (ou `tipo_usuario === "admin"`). */
  hasFullAccess: boolean;
  /** Exige todas as permissões informadas (`mode="any"` para exigir uma). */
  can: (
    permissions?: PermissionCode | PermissionCode[],
    mode?: PermissionMatchMode,
  ) => boolean;
  /** Basta uma das permissões. */
  canAny: (permissions: PermissionCode[]) => boolean;
  /** Exige todas — igual a `can`, explícito. */
  canAll: (permissions: PermissionCode[]) => boolean;
  canModule: (module: string, action?: PermissionAction) => boolean;
  hasFeature: (feature?: string | string[], mode?: PermissionMatchMode) => boolean;
  hasLevel: (level?: UserLevel | UserLevel[]) => boolean;
  /** Mesma avaliação usada pelo componente `Can`. */
  check: (criteria?: AccessCriteria) => boolean;
}
