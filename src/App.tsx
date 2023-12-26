import {useAccount} from 'wagmi'

import {Account} from './components/Account'
import {Connect} from './components/Connect'
import CreateTask from "./components/CreateTask";
import TaskList from "./components/TaskList";

export function App() {
    const {isConnected} = useAccount()

    return (
        <>
            <h1>wagmi + Vite</h1>

            <Connect/>

            {isConnected && (
                <>
                    <hr/>
                    <h2>Account</h2>
                    <Account/>
                    <br/>
                    <hr/>
                    <h2>CreateTask</h2>
                    <CreateTask/>
                    <br/>
                    <hr/>
                    <h2>TaskList</h2>
                    <TaskList/>
                </>
            )}
        </>
    )
}
