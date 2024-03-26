import html2pdf from 'html2pdf.js';
import React, { useRef } from 'react';
import agentData from '../../../utils/licenses.json';

// npm install @avaya/neo-react --force

function License() {
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

    return (
        <>
            <div className='main-header' ref={contentRef}>
                <h3>LICENSE DETAILS</h3>
                <div className='table-div'>
                    <table className='Month-table'>
                        <thead>
                            <tr>
                                <th className='centered-header'>#</th>
                                <th className='centered-header'>Agent Name</th>
                                <th className='centered-header'>License No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentData &&
                                agentData.map((agent, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{agent.agent.name}</td>
                                        <td>{agent.agent.id}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button className='submit-button export3' onClick={convertToPdf}>
                Export to PDF
            </button>
        </>
    );
}

export default License;
