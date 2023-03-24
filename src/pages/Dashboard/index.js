import './dashboard.css';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import firebase from 'firebase/app';
import Modal from '../../components/Modal';

const listRef = firebase.firestore().collection('requests').orderBy('created', 'desc');

export default function Dashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {
        async function loadRequests() {
            await listRef
                .limit(5)
                .get()
                .then((snapshot) => {
                    updateState(snapshot);
                })
                .catch((err) => {
                    console.log(err);
                    setLoadingMore(false);
                });

            setLoading(false);
        }

        loadRequests();

        return () => {};
    }, []);

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let list = [];

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    subject: doc.data().subject,
                    customer: doc.data().customer,
                    clientID: doc.data().clientID,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complement: doc.data().complement,
                });
            });

            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // Catching the last doc searched

            setRequests((requests) => [...requests, ...list]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function handleMore() {
        setLoadingMore(true);
        await listRef
            .startAfter(lastDocs)
            .limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            });
    }

    function togglePostModal(item) {
        setShowPostModal(!showPostModal); //true or false based on value
        setDetail(item);
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className="content">
                    <Title name="Requests">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Searching for requests</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Requests">
                    <FiMessageSquare size={25} />
                </Title>

                {requests.length === 0 ? (
                    <div className="container dashboard">
                        <span>No requests registered...</span>

                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#FFF" />
                            New request
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#FFF" />
                            New request
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Customer</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Registered in</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td data-label="Customer">{item.customer}</td>
                                            <td data-label="Subject">{item.subject}</td>
                                            <td data-label="Status">
                                                <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: item.status === 'Opened' ? '#5cb85c' : '#999',
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td data-label="Registered">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button
                                                    className="action"
                                                    style={{
                                                        backgroundColor: '#3583f6',
                                                    }}
                                                    onClick={() => togglePostModal(item)}
                                                >
                                                    <FiSearch color="#FFF" size={17} />
                                                </button>
                                                <Link
                                                    className="action"
                                                    style={{
                                                        backgroundColor: '#5cb85c',
                                                    }}
                                                    to={`/new/${item.id}`}
                                                >
                                                    <FiEdit2 color="#FFF" size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {loadingMore && <h3 style={{ textAlign: 'center', marginTop: 15 }}>Searching data....</h3>}

                        {!loadingMore && !isEmpty && (
                            <button className="btn-more" onClick={handleMore}>
                                Show more
                            </button>
                        )}
                    </>
                )}
            </div>
            {showPostModal && <Modal content={detail} close={togglePostModal} />}
        </div>
    );
}
