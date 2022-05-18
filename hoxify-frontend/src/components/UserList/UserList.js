import React from "react";
import * as apiCalls from '../../api/apiCalls'
import UserListItem from "../UserListItem/UserListItem";

class UserList extends React.Component {

    state = {
        page: {
            content: [],
            number: 0,
            size: 3
        }
    }

    componentDidMount() {
       this.loadDATA()
    }

    loadDATA = (requestPage = 0) => {
        apiCalls.listUsers( {
            page: requestPage,
            size: this.state.page.size
        }).then((response) => {
            this.setState({
                page: response.data,
                loadError: undefined
            })
        }).catch((error) => {
            this.setState({ loadError: 'User load failed' })
        })
    }

    onClickNextPage = () => {
        this.loadDATA(this.state.page.number + 1)
    }

    onClickPreviousPage = () => {
        this.loadDATA(this.state.page.number - 1)
    }

    render() {
        const nextPageButton = !this.state.page.last &&
            <span className="btn"
                  style={{cursor: 'pointer', float: 'right', borderColor: 'black'}}
                  onClick={this.onClickNextPage}>
                        {`next >`}
            </span>

        const previousPageButton = !this.state.page.first &&
            <span className="btn"
                  style={{cursor: 'pointer', float: 'left', borderColor: 'black'}}
                  onClick={this.onClickPreviousPage}>
                       {`< previous`}
            </span>

        const errorMessage = this.state.loadError &&
            <span className="alert alert-danger">
                {this.state.loadError}
            </span>

        return (
            <div className="card">
                <h3 className="card-title m-auto">Users</h3>
                <div className="list-group list-group-flush" data-testid="usergroup">
                    { this.state.page.content.map(user => {
                        return (<UserListItem key={user.username} user={user}/>)
                    })}
                </div>
                <div>
                    {previousPageButton}
                    {nextPageButton}
                </div>
                {errorMessage}
            </div>
        )
    }
}

export default UserList