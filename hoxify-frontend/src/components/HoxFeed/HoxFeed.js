import React, {Component} from 'react';
import * as apiCalls from '../../api/apiCalls'
import Spinner from "../Spinner/Spinner";
import HoxView from "../HoxView/HoxView";

class HoxFeed extends Component {
    state = {
        page: {
            content: []
        },
        isLoadingHoxes: false,
        newHoxCount: 0
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
            apiCalls
                .loadOldHoxes(hoxAtBottom.id, this.props.user)
                .then(response => {
                    const page = { ...this.state.page }
                    page.content = [...page.content, ...response.data.content]
                    page.last = response.data.last
                    this.setState({ page })
                })
        }
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
                    <div className="card card-header text-center">
                        {this.state.newHoxCount === 1
                            ? 'There is 1 new hox'
                            : `There is ${this.state.newHoxCount} new hoxes`}
                    </div>
                )}
                {this.state.page.content.map(hox => {
                    return <HoxView key={hox.id} hox={hox}/>
                })}

                {!this.state.page.last &&
                <div style={{cursor: 'pointer'}}
                    onClick={this.onClickLoadMoreHandler}>
                    Load More
                </div>}
            </div>)
    }
}

export default HoxFeed;