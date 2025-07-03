import { useSelector} from 'react-redux';
import type { RootState } from '../store/store'; 




export const useAuth = () => {

  
  const context=useSelector((state: RootState) => state.auth);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


