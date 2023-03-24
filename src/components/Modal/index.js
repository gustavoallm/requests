import './modal.css';
import { FiX } from 'react-icons/fi';

export default function Modal({ content, close }) {
    return (
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={23} color="#FFF" />
                    Back
                </button>
                <div>
                    <h2>Request details</h2>
                    <div className="row">
                        <span>
                            Customer: <i>{content.customer}</i>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Subject: <i>{content.subject}</i>
                        </span>
                        <span>
                            Created in: <i>{content.createdFormated}</i>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Status:{' '}
                            <i
                                style={{
                                    color: '#FFF',
                                    backgroundColor: content.status === 'Aberto' ? '#5cb85c' : '#999',
                                }}
                            >
                                {content.status}
                            </i>
                        </span>
                    </div>

                    {content.complement !== '' && (
                        <>
                            <h3>Complement:</h3>
                            <p>{content.complement}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
