import Axios from 'axios'
import React, { Component } from 'react'
import './SingleCompaign.css'
import avtar from '../../../assets/avtar.jpg'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Spinner from '../../../Containers/Spinner/Spinner'
import Modal from '../../../Containers/Modal/Modal'

export class SingleCompaign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      singleCompaign: {},
      error: {
        message: '',
        code: '',
      },
      isloading: false,
      show: false,
    }
  }

  showModal = () => {
    this.setState({ show: true })
  }

  hideModal = () => {
    this.setState({ show: false })
  }

  componentDidMount() {
    this.setState((pre) => ({
      isloading: true,
    }))
    let id = this.props.match.params.id
    Axios.get('/compaigns/' + id)
      .then((res) => {
        this.setState({
          ...this.state.singleCompaign,
          singleCompaign: res.data,
          isloading: false,
        })
        return Axios.get('/profile/bycreator/' + res.data.creator)
      })
      .then((data) => {
        this.setState({
          ...this.state.singleCompaign,
          user: data.data.profile,
          isloading: false,
        })
      })
      .catch((e) => {
        this.setState({
          isloading: false,
          error: {
            ...this.state.error,
            message: e.response.data.message,
            code: e.response.status,
          },
        })
      })
  }

  deleteCompaign = (id) => {
    this.setState((pre) => ({
      isloading: true,
    }))
    Axios.delete('/compaigns/' + id)
      .then((data) => {
        this.setState((pre) => ({
          isloading: false,
        }))
        this.props.history.push('/mycompaign')
      })
      .catch((e) => {
        this.setState({
          isloading: false,
          error: {
            ...this.state.error,
            message: e.response.data.message,
            code: e.response.status,
          },
        })
      })
  }

  render() {
    let isLoading
    let iserror

    if (this.state.isloading) {
      isLoading = (
        <>
          <div className='container loading'>
            <div className='mar-20'>
              <Spinner />
            </div>
          </div>
        </>
      )
    }

    if (this.state.error.code) {
      iserror = (
        <>
          <div className='container error container-short'>
            <div className='mar-20'>
              <h5>Error Code - {this.state.error.code}</h5>
              <h4>Error Message - {this.state.error.message}</h4>
            </div>
          </div>
        </>
      )
    }

    let compaign
    let compaign1 = this.state.singleCompaign
    let user = this.state.user
    if (this.state.singleCompaign) {
      compaign = (
        <>
          <h2>{compaign1.title}</h2>
          <div className='SingleBlog_avatar'>
            <Link to={'/public/' + user?.companyName} rel='noopener noreferrer'>
              <img
                src={user?.imagePath ? user.imagePath : avtar}
                alt='img'
                width='75'
                height='75'
              />
            </Link>

            <Link to={'/public/' + user?.companyName} rel='noopener noreferrer'>
              <p>{user?.companyName}</p>
            </Link>
            <p>{moment(compaign1.compaignDate).format('MMM DD, YYYY hh:mm')}</p>
          </div>
          <div className='singleCompaign_content pt-3'>
            <img
              src={compaign1.imagePath}
              className='img-fluid'
              width='500'
              alt='prof'
            />
            <div className='text pt-3'>
              <p>{compaign1.pitchMaterial}</p>
              <p>zorison dun: {compaign1.targetPrice}</p>
              <p>{compaign1.planDetails}</p>
            </div>
          </div>
        </>
      )
    }
    return (
      <>
        {isLoading}
        {iserror}
        <div className=' py-4 SingleBlog '>
          <div className='row'>
            {this.props.match.path === '/mycompaign/:id' && (
              <div className='col-md-3 col-xs-12 '>
                <div className='list-group'>
                  <Link
                    to={'/edit/' + compaign1._id}
                    className='list-group-item list-group-item-action'
                  >
                    Засах
                  </Link>
                  <button
                    type='button'
                    onClick={this.showModal}
                    className='list-group-item list-group-item-action'
                  >
                    Устгах
                  </button>
                </div>
              </div>
            )}
            <div className='col-md-9 col-xs-12 main'>
              <Modal show={this.state.show} handleClose={this.hideModal}>
                <div className='modal-header'>
                  <h2>{compaign1.title}</h2>
                  <h2>{compaign1.pitchMaterial}</h2>
                  <h2>dun: {compaign1.targetPrice}</h2>
                  <button
                    type='button'
                    className='close'
                    data-dismiss='modal'
                    onClick={this.hideModal}
                  >
                    &times;
                  </button>
                </div>
                <div className='modal-body'>
                  Та устгахдаа итгэлтэй байна уу?
                </div>

                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={() => this.deleteCompaign(compaign1._id)}
                  >
                    Устгах{' '}
                  </button>
                  <button
                    type='button'
                    className='btn btn-outline-dark'
                    onClick={this.hideModal}
                    data-dismiss='modal'
                  >
                    Болих
                  </button>
                </div>
              </Modal>
              {compaign}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default SingleCompaign
