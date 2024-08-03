import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import { useRef, useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import axios from '../api/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import useToggle from '../hooks/useToggle'
import Icon from 'react-icons-kit'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'
import { eye } from 'react-icons-kit/feather/eye'

const LOGIN_URL = '/auth';


const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, userAttribs] = useInput('user', '');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false)
    const [isVisible, setIsVisible] = useState(true)

    const eyeDiv = () => {
        const eyeIcon = document.getElementById('eye-icon')
        eyeIcon.classList.toggle('hidden')
        eyeIcon.classList.toggle('flex')
    }

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;

            setAuth({ user, accessToken });
            resetUser();
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => console.log(codeResponse),
        flow: 'auth-code',
        onError: (error) => console.log('Login Failed:', error)
    })

    /*  const togglePersist = () => {
         setPersist(prev => !prev);
     }
 
     useEffect(() => {
         localStorage.setItem("persist", persist)
     }, [persist])
  */
    return (
        <>
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign in</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        {...userAttribs}
                        value={user}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <div id='eye-icon' className='flex hidden eye-div'><button className="eye-botton"><Icon onClick={(e) => {
                        e.preventDefault()
                        setIsVisible(!isVisible)
                    }} icon={isVisible ? eyeOff : eye} size={22} /></button></div>
                    <input
                        type={isVisible ? 'password' : 'text'}
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        onClick={eyeDiv}
                        value={pwd}
                        required
                    />
                    <button>Sign in</button>
                    <div className='persistCheck'>
                        <input
                            type="checkbox"
                            id='persist'
                            onChange={toggleCheck}
                            checked={check} />
                        <label htmlFor="persist">Trust This Device</label>
                    </div>
                </form>
                <p>
                    Need an Account?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <Link to={'/register'}>Sign up</Link>
                    </span>
                </p>
                <div className='login-button'>
                    <button onClick={login} className='bg-teal-700 mb-12 border rounded-full p-3 text-white font-bold'>Sign in with Google</button>
                </div>
            </section>

        </>
    )
}

export default Login
