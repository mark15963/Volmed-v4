import moment from 'moment';
import tableStyles from '../../../components/styles/Table.module.css';
import styles from '../searchResults.module.css';

export const Tab3 = ({
    assignments,
    isEditingAssignments,
    setAssignments,
    data,
    handleSaveAssignments
}) => {
    return (
        <div className={styles.info}>
            <div className={styles.bg} style={{ padding: '20px' }}>
                <h3>Назначения</h3>
                {assignments.length === 0 && !isEditingAssignments && (
                    <p>Нет назначений</p>
                )}
                {isEditingAssignments && (
                    <>
                        <button
                            onClick={() => {
                                setAssignments([...assignments, {
                                    name: '',
                                    dosage: '',
                                    frequency: '',
                                    administered: [],
                                    createdAt: new Date().toISOString()
                                }]);
                            }}
                            style={{ marginBottom: '10px', marginLeft: '0' }}>Добавить</button>
                    </>
                )}
                {(assignments.length > 0 || isEditingAssignments) && (
                    <div className={tableStyles.container}>
                        <table className={tableStyles.table} style={{ width: '100%', tableLayout: 'fixed' }}>

                            <thead className={tableStyles.head}>
                                <tr className={tableStyles.rows} style={{ fontSize: '13px' }}>
                                    <th style={{ width: '20%', textAlign: 'center' }}>Время назначения</th>
                                    <th style={{ width: '30%', textAlign: 'center' }}>Препарат / Манипуляция</th>
                                    <th style={{ width: '15%', textAlign: 'center' }}>Дозировка</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Частота</th>
                                    <th style={{ width: '25%', textAlign: 'center' }}>Отмечено медсестрой</th>
                                    {isEditingAssignments && <th style={{ width: '15%' }}>Удалить</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map((item, index) => (
                                    <tr key={index} className={tableStyles.rows} style={{ fontSize: '14px', display: 'flex' }}>
                                        <td style={{ width: '20%', fontSize: '11px' }}>
                                            {item.createdAt ? moment(item.createdAt).format('DD.MM.YYYY HH:mm') : 'Н/Д'}
                                        </td>
                                        <td style={{ width: '30%' }}>
                                            {isEditingAssignments ? (
                                                <input
                                                    style={{ width: '100%', borderRadius: '5px', paddingLeft: '5px' }}
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const newList = [...assignments];
                                                        newList[index].name = e.target.value;
                                                        setAssignments(newList);
                                                    }}
                                                />
                                            ) : item.name}
                                        </td>
                                        <td style={{ width: '15%' }}>
                                            {isEditingAssignments ? (
                                                <input
                                                    style={{ width: '100%', borderRadius: '5px', paddingLeft: '5px' }}
                                                    value={item.dosage}
                                                    onChange={(e) => {
                                                        const newList = [...assignments];
                                                        newList[index].dosage = e.target.value;
                                                        setAssignments(newList);
                                                    }}
                                                />
                                            ) : item.dosage}
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            {isEditingAssignments ? (
                                                <input
                                                    style={{ width: '100%', borderRadius: '5px', paddingLeft: '5px' }}
                                                    value={item.frequency}
                                                    onChange={(e) => {
                                                        const newList = [...assignments];
                                                        newList[index].frequency = e.target.value;
                                                        setAssignments(newList);
                                                    }}
                                                />
                                            ) : item.frequency}
                                        </td>
                                        <td style={{ width: '25%', display: 'flex' }}>
                                            <button
                                                style={{
                                                    width: 'fit-content', height: 'fit-content', padding: '1px 5px',
                                                    fontSize: '12px'
                                                }}
                                                onClick={() => {
                                                    const newList = [...assignments];
                                                    newList[index].administered.push(new Date().toISOString());
                                                    setAssignments(newList);
                                                }}
                                            >
                                                Отметить
                                            </button>
                                            <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '5px', height: 'fit-content' }}>
                                                {item.administered.map((time, i) => (
                                                    <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: '10px' }}>
                                                        <span style={{ fontSize: '10px' }}>{moment(time).format('DD.MM.YY HH:mm')}</span>
                                                        {isEditingAssignments && (
                                                            <button
                                                                onClick={() => {
                                                                    const newList = [...assignments];
                                                                    newList[index].administered.splice(i, 1);
                                                                    setAssignments(newList);
                                                                }}
                                                                style={{
                                                                    marginLeft: '5px',
                                                                    fontSize: '10px',
                                                                    padding: '2px 4px',
                                                                    color: 'red',
                                                                    border: 'none',
                                                                    background: 'transparent',
                                                                    cursor: 'pointer'
                                                                }}
                                                                title="Удалить отметку"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        {isEditingAssignments && (
                                            <td style={{ width: '15%' }}>
                                                <button
                                                    style={{ width: 'fit-content', height: 'fit-content', padding: '1px 5px' }}
                                                    onClick={async () => {
                                                        const itemToDelete = assignments[index];
                                                        if (itemToDelete.id) {
                                                            try {
                                                                await axios.delete(`http://localhost:5000/api/medications/${itemToDelete.id}`);
                                                            } catch (err) {
                                                                console.error("Ошибка при удалении:", err);
                                                                alert("Не удалось удалить назначение.");
                                                                return;
                                                            }
                                                        }
                                                        const newList = assignments.filter((_, i) => i !== index);
                                                        setAssignments(newList);
                                                    }}> Удалить</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    )
}