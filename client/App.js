import React, { Component } from 'react';
import io from 'socket.io-client';

import styles from './App.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';

const socket = io('/');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            messages: [],
            text: '',
            name: ''
        }
    };

    componentDidMount() {
        socket.on('message', message => this.messageReceive(message));
        socket.on('update', ({users}) => this.chatUpdate(users));
    }
    /* odbieranie wiadmości z servera*/
    messageReceive(message) {
        const messages = [message, ...this.state.messages];
        this.setState({messages});
    }

    chatUpdate(users) {
        this.setState({users});
    }

    /* użytkownik wysyła wiadomośc metoda ją przechwytuje auaktualnia tabelę z wiadomościami i wysyła wpisaną wiodomości na serwer */
    handleMessageSubmit(message) {
        const messages = [message, ...this.state.messages];
        this.setState({messages})
        socket.emit('message', message);
    }
    /* Uzytowniki wpisuje imie w formularzu i je zatwierdza metoda przechwytuje imie umieszcza w stanie name i wysyła do serwera */
    handleUserSubmit(name) {
        this.setState({name});
        socket.emit('join', name);
    }

    render() {
        /* jeżeli this.state.name nie jest puste to wyrenderuj aplikację a jeżeli jest puste to wyrenderuj formularz do wpisania imienia */
        return this.state.name !== '' ? this.renderLayout() : this.renderUserForm();
    };

    renderLayout() {
        return (
            <div className={style.App}>
                <div className={styles.AppHeader}>
                    <div className={styles.AppTitle}>
                        ChatApp
                    </div>
                    <div className={styles.AppRoom}>
                        App room
                    </div>
                </div>
                <div className={styles.AppBody}>
                    <UserList
                        users={this.state.users}
                    />
                    <div className={styles.MessageWrapper}>
                        <MessageList 
                            messages={this.state.messages}
                        />
                        <MessageForm 
                            onMessageSubmit={message => this.handleMessageSubmit(message)}
                            name={this.state.name}
                        />
                    </div>
                </div>
            </div>
        )
    };

    renderUserForm() {
        return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)}/>)
    };
}


export default App;