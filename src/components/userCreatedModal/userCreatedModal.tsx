import './userCreatedModal.scss';
import Button from '../common/button.tsx';

interface UserCreatedModalProps {
    onNavigateToLogin: () => void;
}
const UserCreatedModal:React.FC<UserCreatedModalProps> = ({onNavigateToLogin}) => {

    return(
        <div className="user-created-modal">
            <h2>User Created Successfully!</h2>
            <Button onClick={onNavigateToLogin} color='light'  text='Continue to login'/>   
        </div>
    );
};

export default UserCreatedModal;