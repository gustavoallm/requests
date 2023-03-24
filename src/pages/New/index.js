import { useState, useEffect, useContext } from 'react';

import firebase from 'firebase/app';
import { useHistory, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import './new.css';
import { FiPlusCircle } from 'react-icons/fi';
import { fi } from 'date-fns/locale';

export default function New() {
    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [subject, setSubject] = useState('Support');
    const [status, setStatus] = useState('Opened');
    const [complement, setComplement] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers() {
            await firebase
                .firestore()
                .collection('customers')
                .get()
                .then((snapshot) => {
                    let lista = [];
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            clientName: doc.data().clientName,
                        });
                    });
                    if (lista.length === 0) {
                        console.log('No companies found!');
                        setCustomers([{ id: '1', clientName: 'FreeLance' }]);
                        setLoadCustomers(false);
                        return;
                    }

                    setCustomers(lista);
                    setLoadCustomers(false);

                    if (id) {
                        loadId(lista);
                    }
                })
                .catch((error) => {
                    console.log('Opss! Something get wrong!', error);
                    setLoadCustomers(false);
                    setCustomers([{ id: '1', clientName: 'FreeLance' }]);
                });
        }
        loadCustomers();
    }, [id]);

    async function loadId(lista) {
        await firebase
            .firestore()
            .collection('requests')
            .doc(id)
            .get()
            .then((snapshot) => {
                setSubject(snapshot.data().subject);
                setStatus(snapshot.data().status);
                setComplement(snapshot.data().complement);

                let index = lista.findIndex((item) => item.id === snapshot.data().clientID);
                setCustomerSelected(index);
                setIdCustomer(true);
            })
            .catch((err) => {
                console.log('Error! Wrong id', err);
                setIdCustomer(false);
            });
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (idCustomer) {
            await firebase
                .firestore()
                .collection('requests')
                .doc(id)
                .update({
                    customer: customers[customerSelected].clientName,
                    clientID: customers[customerSelected].id,
                    subject: subject,
                    status: status,
                    complement: complement,
                    userID: user.uid,
                })
                .then(() => {
                    toast.success('Successfully edited!');
                    setCustomerSelected(0);
                    setComplement('');
                    history.push('/dashboard');
                })
                .catch((err) => {
                    toast.error('Error on editing, try again later :(');
                });

            return;
        }

        await firebase
            .firestore()
            .collection('requests')
            .add({
                created: new Date(),
                customer: customers[customerSelected].clientName,
                clientID: customers[customerSelected].id,
                subject: subject,
                status: status,
                complement: complement,
                userID: user.uid,
            })
            .then(() => {
                toast.success('Request created successfully!');
                setComplement('');
                setCustomerSelected(0);
            })
            .catch((err) => {
                toast.error('Error on register! try again later.');
                console.log(err);
            });
    }

    // Called when subject change
    function handleChangeSelect(e) {
        setSubject(e.target.value);
    }

    // Called when status change
    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    // Called when client change
    function handleChangeCustomers(e) {
        //console.log('Selected client index: ', e.target.value);
        //console.log('Selected client ', customers[e.target.value]);
        setCustomerSelected(e.target.value);
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="New request">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Customer</label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Loading customers..." />
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.clientName}
                                        </option>
                                    );
                                })}
                            </select>
                        )}

                        <label>Subject</label>
                        <select value={subject} onChange={handleChangeSelect}>
                            <option value="Support">Support</option>
                            <option value="Technical visit">Technical visit</option>
                            <option value="Financial">Financial</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Opened"
                                onChange={handleOptionChange}
                                checked={status === 'Opened'}
                            />
                            <span>Opened</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Progress"
                                onChange={handleOptionChange}
                                checked={status === 'Progress'}
                            />
                            <span>In progress</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Finished"
                                onChange={handleOptionChange}
                                checked={status === 'Finished'}
                            />
                            <span>Finished</span>
                        </div>

                        <label>Complement</label>
                        <textarea
                            type="text"
                            placeholder="Describe your problem (optional)"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                        />

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
