import { TextFilterType } from '../../shared/enums/textFilterType.enums';

export interface UsersQuery {
  firstName?: string;
  lastName?: string;
  email?: string;
  emailFilterType?: TextFilterType;
  minAge?: string;
  maxAge?: string;
  role?: string;
  sortField?: string;
  orderDirection?: 'DESC' | 'ASC';
}
