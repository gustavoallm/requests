import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';
import './signin.css';
import logo from '../../assets/logo.png';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, loadingAuth } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();
        if (email !== '' && password !== '') {
            signIn(email, password);
        }
    }

    return (
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do sistema" />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">
                        {loadingAuth ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <Link to="/register">Create account</Link>
            </div>
        </div>
    );
}

export default SignIn;
