import React, {Component} from 'react';
import * as apiCalls from '../../api/apiCalls'
import Spinner from "../Spinner/Spinner";
import HoxView from "../HoxView/HoxView";
import Modal from "../Modal/Modal";

class HoxFeed extends Component {
    state = {
        page: {
            content: []
        },
        isLoadingHoxes: false,
        newHoxCount: 0,
        isLoadingOldHoxes: false
    }
    componentDidMount() {
        this.setState({ isLoadingHoxes: true})
        apiCalls.loadHoxes(this.props.user)
            .then(response => {
                this.setState({ page: response.data, isLoadingHoxes: false },
                    () => {
                    this.counter = setInterval(this.checkCountHandler, 3000)
                    })
            })
    }

    componentWillUnmount() {
        clearInterval(this.counter)
    }

    onClickDeleteHox = (hox) => {
        this.setState({
            hoxToBeDeleted: hox
        })
    }

    onClickModalCancel = () => {
        this.setState({
            hoxToBeDeleted : undefined
        })
    }

    checkCountHandler = () => {
        const hoxes = this.state.page.content
        let topHoxId
        if (hoxes.length > 0) {
            topHoxId = hoxes[0].id
        }

        const topHox = hoxes[0]
        apiCalls.loadNewHoxCount(topHoxId, this.props.user)
            .then(response => {
                this.setState({
                    newHoxCount: response.data.count
                })
            })

    }

    onClickLoadMoreHandler = () => {
        const hoxes = this.state.page.content
        if (hoxes.length !== 0 ) {
            const hoxAtBottom = hoxes[ hoxes.length - 1 ]
            this.setState({ isLoadingOldHoxes : true })
            apiCalls
                .loadOldHoxes(hoxAtBottom.id, this.props.user)
                .then(response => {
                    const page = { ...this.state.page }
                    page.content = [...page.content, ...response.data.content]
                    page.last = response.data.last
                    this.setState({ page, isLoadingOldHoxes: false})
                })
                .catch(error => {
                    this.setState({ isLoadingOldHoxes: false})
                })
        }
    }

    onClickLoadNewHandler = () => {
        const hoxes = this.state.page.content
        let topHoxId
        if (hoxes.length > 0) {
            topHoxId = hoxes[0].id
        }
        apiCalls.loadNewHoxes(topHoxId, this.props.user)
            .then(response => {
                const page = { ...this.state.page }
                page.content = [...response.data, ...page.content]
                this.setState({ page, newHoxCount: 0})
            })
    }

    render() {
        if (this.state.isLoadingHoxes) {
            return <Spinner/>
        }
        if (this.state.page.content.length === 0 && this.state.newHoxCount === 0) {
            return (
                <div className="card card-header text-center">
                    There are no hoxes
                </div>
            );
        }
        return (
            <div>
                {this.state.newHoxCount > 0 && (
                    <div className="card card-header text-center"
                         style={{ cursor: 'pointer'}}
                         onClick={this.onClickLoadNewHandler}>
                        {this.state.newHoxCount === 1
                            ? 'There is 1 new hox'
                            : `There is ${this.state.newHoxCount} new hoxes`}
                    </div>
                )}
                {this.state.page.content.map(hox => {
                    return <HoxView key={hox.id}
                                    hox={hox}
                                    onClickDelete={() => this.onClickDeleteHox(hox)}
                    />
                })}

                {!this.state.page.last &&
                <div style={{cursor: this.state.isLoadingOldHoxes ? 'not-allowed' : 'pointer'}}
                    onClick={!this.state.isLoadingOldHoxes && this.onClickLoadMoreHandler}>
                    {this.state.isLoadingOldHoxes ? <Spinner/> : 'Load More'}
                </div>}
                <Modal
                    visible={this.state.hoxToBeDeleted && true}
                    onClickCancel={this.onClickModalCancel}
                    body={
                        this.state.hoxToBeDeleted &&
                        `Are you sure to delete ${this.state.hoxToBeDeleted.content} ?`}
                    title="Delete!"
                    okButton="Delete Hox"
                />
            </div>)
    }
}

export default HoxFeed;