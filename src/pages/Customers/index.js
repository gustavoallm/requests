import { useState } from 'react';
import './customers.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import firebase from 'firebase/app';
import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Customers() {
    const [clientName, setClientName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [address, setAddress] = useState('');

    async function handleAdd(e) {
        e.preventDefault();

        if (clientName !== '' && cnpj !== '' && address !== '') {
            await firebase
                .firestore()
                .collection('customers')
                .add({
                    clientName: clientName,
                    cnpj: cnpj,
                    address: address,
                })
                .then(() => {
                    setClientName('');
                    setCnpj('');
                    setAddress('');
                    toast.info('Company registered successfully!');
                })
                .catch((error) => {
                    console.log(error);
                    toast.error('Something went wrong!');
                });
        } else {
            toast.error('Please fill in all fields!!!');
        }
    }
    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Customers">
                    <FiUser size={25} />
                </Title>
                <div className="container">
                    <form
                        className="form-profile customers"
                        onSubmit={handleAdd}
                    >
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Name of your business"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input
                            type="text"
                            placeholder="Your CNPJ"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                        />
                        <label>Address</label>
                        <input
                            type="text"
                            placeholder="Business address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
