import { Spinner } from '@avaya/neo-react';
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import html2pdf from 'html2pdf.js';
import { default as React, useEffect, useRef, useState } from 'react';
import AddNewAgent from './AddNewAgent';
import DeleteData from './DeleteData';
import PopUp from './PopUp';
import UpdatData from './UpdatData';

function LicenseInfo() {
    // function for export in pdf
    const contentRef = useRef(null);
    const convertToPdf = () => {
        const content = contentRef.current;
        const options = {
            filename: 'my-chart.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 4 },
            jsPDF: {
                unit: 'cm',
                format: 'letter',
                orientation: 'landscape',
            },
        };

        html2pdf().set(options).from(content).save();
    };

    const [LicensesData, SetLicensesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isEditing, setIsEditing] = useState(true);
    const [isDelete, setisDelete] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetch('https://rahul.lab.bravishma.com/cobrowse/accounts')
            .then((response) => response.json())
            .then((data) => SetLicensesData(data));
        setIsLoading(false);
    }, []);

    const handleViewAgent = (agent) => {
        setSelectedAgent(agent);
        setIsEditing(false);
        setisDelete(false);
    };

    const handleEditAgent = (agent) => {
        setSelectedAgent(agent);
        setIsEditing(true);
        setisDelete(false);
    };

    const handleDeleteAgent = (agent) => {
        setSelectedAgent(agent);
        setIsEditing(false);
        setisDelete(true);
    };

    const handleClosePopUp = () => {
        setSelectedAgent(null);
        setisDelete(false);
    };

    return (
        <div className='main-header'>
            <h1>LICENSES ALL INFO </h1>

            {isLoading ? (
                <Spinner size='xl' className='spinner-for-chart' />
            ) : (
                <>
                    <button onClick={() => setShowForm(true)} className='submit-button'>
                        Add New License
                    </button>

                    <table ref={contentRef}>
                        <thead>
                            <tr>
                                <th className='centered-header'>#</th>
                                <th className='centered-header'>Name</th>
                                <th className='centered-header'>Licenses</th>
                                <th className='centered-header'>Agent ID</th>
                                <th className='centered-header'>Token</th>
                                <th className='centered-header'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LicensesData.map((agent, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{agent.agentName}</td>
                                    <td>{agent.licenseKey}</td>
                                    <td>{agent._id}</td>
                                    <td className='token'>{agent.token}</td>

                                    <td>
                                        <div className='icon-list'>
                                            <span onClick={() => handleViewAgent(agent)}>
                                                <FontAwesomeIcon className='icon' icon={faEye} />
                                            </span>
                                            <span onClick={() => handleEditAgent(agent)}>
                                                <FontAwesomeIcon
                                                    className='icon'
                                                    icon={faPenToSquare}
                                                />
                                            </span>
                                            <span onClick={() => handleDeleteAgent(agent)}>
                                                <FontAwesomeIcon className='icon' icon={faTrash} />
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {selectedAgent && !isEditing && (
                <PopUp selectedAgent={selectedAgent} handleClosePopUp={handleClosePopUp} />
            )}
            {selectedAgent && isEditing && (
                <UpdatData LicensesData={LicensesData} SetLicensesData={SetLicensesData} selectedAgent={selectedAgent} handleClosePopUp={handleClosePopUp} />
            )}

            {isDelete && (
                <DeleteData selectedAgent={selectedAgent} SetLicensesData={SetLicensesData} handleClosePopUp={handleClosePopUp} />
            )}

            {showForm && (
                <AddNewAgent SetLicensesData={SetLicensesData} setShowForm={setShowForm} handleClosePopUp={handleClosePopUp} />
            )}
            <button className='submit-button export2' onClick={convertToPdf}>
                Export to PDF
            </button>
        </div>
    );
}

export default LicenseInfo;
