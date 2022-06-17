import React, {Component} from 'react';
import * as apiCalls from '../../api/apiCalls'
import Spinner from "../Spinner/Spinner";
import HoxView from "../HoxView/HoxView";

class HoxFeed extends Component {
    state = {
        page: {
            content: []
        },
        isLoadingHoxes: false
    }
    componentDidMount() {
        this.setState({ isLoadingHoxes: true})
        apiCalls.loadHoxes(this.props.user)
            .then(response => {
                this.setState({
                    page: response.data,
                    isLoadingHoxes: false
                })
                console.log(response.data)
            })
    }

    render() {
        if (this.state.isLoadingHoxes) {
            return <Spinner/>
        }
        if (this.state.page.content.length === 0) {
            return (
                <div className="card card-header text-center">
                    There are no hoxes
                </div>
            );
        }
        return (
            <div>
                {this.state.page.content.map(hox => {
                    return <HoxView key={hox.id} hox={hox}/>
                })}

                {!this.state.page.last && <div>Load More</div>}
            </div>)
    }
}

export default HoxFeed;