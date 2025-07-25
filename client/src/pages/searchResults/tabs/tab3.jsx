import moment from 'moment';
import axios from 'axios';

import api from '../../../services/api';

import Input from '../../../components/Input';
import Button from '../../../components/Buttons';

import tableStyles from '../../../components/styles/Table.module.css';
import styles from './tab3.module.scss'
import { CalendarTwoTone, FieldTimeOutlined, MedicineBoxTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import debug from '../../../utils/debug';

axios.defaults.withCredentials = true;

export const Tab3 = ({
    assignments,
    isEditingAssignments,
    setAssignments,
}) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleAdd = async () => {
        if (assignments.length === 0 || assignments[assignments.length - 1].name.trim()) {
            debug.log(`Adding new assignment`)
            setAssignments(prev => [...prev, {
                name: '',
                dosage: '',
                frequency: '',
                createdAt: new Date().toISOString()
            }])
        } else {
            // Focus on the empty field in the last row
            const lastRowInput = document.querySelector(`.${styles.table} tr:last-child td:nth-child(2) input`);
            if (lastRowInput) {
                lastRowInput.focus();
                message.warning('Пожалуйста, заполните текущее назначение перед добавлением нового');
            }
        }
    }

    const handleDelete = async (index) => {
        const itemToDelete = assignments[index];
        setIsLoading(true)
        debug.log(`Deleting assignment: ${itemToDelete.name}`)

        if (!itemToDelete) {
            alert('Не удалось найти назначение для удаления');
            return;
        }

        if (!window.confirm('Вы уверены, что хотите удалить это назначение?')) {
            setIsLoading(false)
            return;
        }

        try {
            if (itemToDelete.id) {
                const response = await api.deleteMedication(itemToDelete.id)
                if (!response.data.success) {
                    throw new Error(response.data.message || "API returned unsuccessful");
                }
            }

            setAssignments(prev => prev.filter((_, i) => i !== index));
            debug.log("Deleted successfully")
        } catch (err) {
            debug.error("Full delete error:", {
                error: err,
                response: err.response?.data
            });
            alert(`Не удалось удалить назначение: ${err.message}`);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.info}>
            <div className={styles.bg}>
                <h2>Назначения</h2>

                {/* EMPTY LIST */}
                {assignments.length === 0 && !isEditingAssignments && (
                    <p>Нет назначений</p>
                )}

                {/* MED LIST */}
                {(assignments.length > 0 || isEditingAssignments) && (
                    <div className={styles.listContainer}>
                        <table className={styles.table}>
                            <thead className={styles.head}>
                                <tr className={styles.rows}>
                                    <th>Время назначения</th>
                                    <th>Препарат / Манипуляция</th>
                                    <th>Дозировка</th>
                                    <th>Частота</th>
                                    {isEditingAssignments && <th style={{ width: '15%' }}>Удалить</th>}
                                </tr>
                            </thead>
                            <tbody className={styles.body}>
                                {assignments.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={styles.rows}
                                    >
                                        {/* Created At */}
                                        <td>
                                            <CalendarTwoTone className={styles.icon} />
                                            <div style={{ display: 'inline-block' }}>
                                                {item.createdAt ? moment(item.createdAt).format(' DD.MM.YYYY HH:mm') : ' Н/Д'}
                                            </div>
                                        </td>
                                        {/* Name */}
                                        <td>
                                            {isEditingAssignments ? (
                                                <Input
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const newList = [...assignments];
                                                        newList[index].name = e.target.value;
                                                        setAssignments(newList);
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <MedicineBoxTwoTone className={styles.icon} />
                                                    <div style={{ display: 'inline-block' }}>
                                                        {item.name}
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                        {/* Dosage */}
                                        <td>
                                            {isEditingAssignments ? (
                                                <Input
                                                    value={item.dosage}
                                                    onChange={(e) => {
                                                        const newList = [...assignments];
                                                        newList[index].dosage = e.target.value;
                                                        setAssignments(newList);
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <FieldTimeOutlined className={styles.icon} />
                                                    <div className={styles.desktop} style={{ display: 'inline-block' }}>
                                                        {item.dosage}
                                                    </div>
                                                    <div className={styles.mobile}>
                                                        {item.dosage} {item.frequency}
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                        {/* Frequency*/}
                                        <td>
                                            <div style={{ display: 'inline-block' }}>
                                                {isEditingAssignments ? (
                                                    <Input
                                                        value={item.frequency}
                                                        onChange={(e) => {
                                                            const newList = [...assignments];
                                                            newList[index].frequency = e.target.value;
                                                            setAssignments(newList);
                                                        }}
                                                    />
                                                ) : (
                                                    <div className={styles.desktop}>
                                                        {item.frequency}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        {/* Delete Button*/}
                                        {isEditingAssignments && (
                                            <td style={{ width: '15%', verticalAlign: 'middle' }}>
                                                <Button
                                                    text='Удалить'
                                                    size='s'
                                                    onClick={() => handleDelete(index)}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* NEW MED */}
                {isEditingAssignments && (
                    <Button
                        text='Добавить'
                        onClick={handleAdd}
                        style={{ marginBottom: '10px', marginLeft: 0 }}
                    />
                )}
            </div>
        </div >
    )
}

export default Tab3