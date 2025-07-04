import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'

import { SearchBar } from '../../components/SearchBar';
import Button from '../../components/Buttons.tsx';
import { useAuth } from '../../context/AuthContext'

import styles from './main.module.css'

export const Main = () => {
    const { authState } = useAuth()
    const navigate = useNavigate()

    if (authState.isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.mainBlock}>
                    <p className={styles.loadingTitle}>
                        Загрузка данных...
                    </p>
                </div>
            </div>
        );
    }

    if (!authState.isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.mainBlock}>
                    <p className={styles.loadingTitle}>
                        Нет доступа
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className={styles.container}>
            <div className={styles.mainBlock}>
                <SearchBar />
                <div className={styles.buttonsContainer}>

                    <Button
                        text='Список пациентов'
                        icon='patients'
                        margin='0 0 0 5px'
                        onClick={() => navigate('/patients')}
                    />

                    <Button
                        text='Новый пациент'
                        icon='newPatient'
                        margin='0 0 0 5px'
                        onClick={() => navigate('/register')}
                    />

                </div>

            </div>
        </div>
    )
}

export default Main