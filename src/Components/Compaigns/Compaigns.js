import Axios from 'axios'
import React, { Component } from 'react'
import ShowCompaign from './ShowCompaign/ShowCompaign'
import img1 from '../../assets/asset-1.png'
import ShowUser from '../Users/ShowUsers/ShowUser'
import Spinner from '../../Containers/Spinner/Spinner'

export class Compaigns extends Component {
  constructor(props) {
    super(props)

    this.state = {
      compaigns: [],
      users: [],
      isloading: false,
    }
  }

  componentDidMount() {
    this.setState((pre) => ({
      isloading: true,
    }))
    Promise.all([Axios.get('/compaigns'), Axios.get('/profile/profiles')])
      .then((data) => {
        this.setState((pre) => ({
          isloading: false,
        }))
        this.setState({
          ...this.state.compaigns,
          compaigns: data[0].data.compaigns,
        })
        this.setState({ ...this.state.users, users: data[1].data.profile })
      })
      .catch((e) => {
        this.setState((pre) => ({
          isloading: false,
        }))
      })
  }

  render() {
    let isLoading
    if (this.state.isloading) {
      isLoading = <Spinner />
    }
    let fetchedcompaigns
    let allUsers
    if (this.state.compaigns) {
      fetchedcompaigns = this.state.compaigns.map((compaign, index) => (
        <ShowCompaign key={index} {...compaign} {...index} />
      ))
    }
    if (this.state.users) {
      allUsers = this.state.users.map((user, index) => (
        <ShowUser key={index} {...user} {...index} />
      ))
    }
    return (
      <div>
        <div className='container hero'>
          <div className='row align-items-center text-center text-md-left'>
            <div className='col-lg-4'>
              <h3 className='mb-3 display-4'>Краудфандингийн систем</h3>
              <p>Хөрөнгө оруулалтад суурилсан Краудфандингийн систем</p>
            </div>
            <div className='col-lg-8'>
              <img src={img1} className='img-fluid' alt='img' />
            </div>
          </div>
        </div>
        <div className='container hero py-5'>
          <div className='row'>
            <div className='col-md-8 col-xs-12'>
              <div className='row'>{fetchedcompaigns}</div>
            </div>

            <div className='col-md-4 col-xs-12 pl-4'>
              <h3 className='mb-4'> Хөрөнгө босгогчид</h3>
              <hr></hr>
              {allUsers}
            </div>
          </div>
        </div>

        <div className='container loading'>{isLoading}</div>
      </div>
    )
  }
}

export default Compaigns
