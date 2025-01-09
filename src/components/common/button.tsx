import '../../styles/button.scss'
type ButtonProps = {
    text: string
    color:'light' |'dark'
} & React.ButtonHTMLAttributes<HTMLButtonElement>;


const Button:React.FC<ButtonProps> =({text,color,...props})=>{

   
    return(
            <button className={color==='light'?'light':'dark'} {...props}>{text}</button>
    );
};

export default Button;