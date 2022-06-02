import Axios from 'axios'
import React, { Component } from 'react'
import ImageUpload from '../../../Containers/ImageUpload/ImageUpload'
import Spinner from '../../../Containers/Spinner/Spinner'

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
export class CreateCompaign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Compaign: {
        id: '',
        title: '',
        planDetails: '',
        fundingType: '',
        pitchMaterial: '',
        status: '',
        videoPath: '',
        imagePath: '',
        created: '',
      },
      error: {
        message: '',
        code: '',
      },
      isloading: false,

      haserror: false,
      errors: {
        title: '',
        planDetails: '',
        fundingType: '',
        pitchMaterial: '',
        status: '',
        videoPath: '',
        imagePath: '',
      },
    }
    this.mySubmitHandler = this.mySubmitHandler.bind(this)
    this.myChangeHandler = this.myChangeHandler.bind(this)
  }

  componentDidMount() {
    let path = this.props.match.path
    let id = this.props.match.params.id
    const storedData = JSON.parse(localStorage.getItem('profileData'))
    if (!storedData && path == '/create') {
      this.props.history.push('/createProfile')
    }
    if (path === '/edit/:id') {
      this.setState((pre) => ({
        isloading: true,
      }))

      Axios.get('/compaigns/' + id)
        .then((data) => {
          let compaign = data.data
          this.setState({
            isloading: false,
            Compaign: {
              ...this.state.Compaign,
              id: compaign._id,
              title: compaign.title,
              pitchMaterial: compaign.pitchMaterial,
              imagePath: compaign.imagePath,
            },
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
    console.log(this.state)
  }

  imageHandler = (id, value, isValid) => {
    this.setState(
      { Compaign: { ...this.state.Compaign, [id]: value } },
      () => {}
    )
  }

  myChangeHandler = (event) => {
    let nam = event.target?.name
    let val = event.target?.value
    let errors = this.state.errors
    const { name, value } = event.target
    switch (name) {
      case 'title':
        if (value.length > 0) {
          errors.title =
            value.length < 6 ? 'Title   must be 5 characters long!' : ''
        }

        if (value.length === 0) {
          errors.title = value.length === 0 ? 'title is required!' : ''
        }
        break

      case 'planDetails':
        if (value.length > 0) {
          errors.planDetails =
            value.length < 20 ? 'planDetails  must be 20 characters long!' : ''
        }

        if (value.length === 0) {
          errors.planDetailst =
            value.length === 0 ? 'planDetails is required!' : ''
        }
        break
      case 'imagePath':
        if (value.length === 0) {
          errors.imagePath = value.length === 0 ? 'Image is required!' : ''
        }
        break
      default:
        break
    }

    this.setState(
      { ...errors, Compaign: { ...this.state.Compaign, [nam]: val } },
      () => {}
    )
  }

  mySubmitHandler(e) {
    this.setState((pre) => ({
      isloading: true,
    }))
    let path = this.props.match.path
    let id = this.props.match.params.id
    let date = new Date()
    e.preventDefault()
    let formData
    if (typeof this.state.Compaign.imagePath === 'object') {
      formData = new FormData()
      formData.append('id', this.state.Compaign.id)
      formData.append('title', this.state.Compaign.title)
      formData.append('planDetails', this.state.Compaign.planDetails)
      formData.append('fundingType', this.state.Compaign.fundingType)
      formData.append('pitchMaterial', this.state.Compaign.pitchMaterial)
      formData.append('videoPath', this.state.Compaign.videoPath)
      formData.append(
        'image',
        this.state.Compaign.imagePath,
        this.state.Compaign.title
      )
      formData.append('postDate', date.toString())
    } else {
      formData = {
        id: this.state.Compaign.id,
        title: this.state.Compaign.title,
        planDetails: this.state.Compaign.planDetails,
        fundingType: this.state.Compaign.fundingType,
        pitchMaterial: this.state.Compaign.pitchMaterial,
        videoPath: this.state.Compaign.videoPath,
        image: this.state.Compaign.imagePath,
        postDate: date.toString(),
      }
    }

    if (path === '/edit/:id') {
      Axios.put('/compaigns/' + id, formData)
        .then((data) => {
          this.setState((pre) => ({
            isloading: false,
          }))
          this.props.history.push('/')
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
    } else {
      Axios.post('/compaigns', formData)
        .then((data) => {
          this.setState((pre) => ({
            isloading: false,
          }))
          this.props.history.push('/')
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
    this.setState({
      Compaign: {
        ...this.state.Compaign,
        title: '',
        planDetails: '',
        fundingType: '',
        pitchMaterial: '',
        videoPath: '',

        imagePath: '',
      },
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

    return (
      <>
        {isLoading}
        {iserror}
        <div className='container container-short'>
          <form onSubmit={this.mySubmitHandler} className='pt-4'>
            <h3 className='text-center mb-3'>Хөрөнгө босголт эхлүүлэх</h3>
            <div className='form-group'>
              <label htmlFor='title'>Нэр </label>
              <input
                type='title'
                name='title'
                value={this.state.Compaign.title}
                className={
                  'form-control ' +
                  (this.state.errors.title ? 'is-invalid' : '')
                }
                placeholder='Enter the title'
                required
                onChange={this.myChangeHandler}
              />

              {this.state.errors.title.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.title}
                  </span>
                </div>
              )}
            </div>
            {/* ------------------------------------------------ */}
            <div className='form-group'>
              <label htmlFor='password'>Төлөвлөгөөний Дэлгэрэнгүй</label>
              <textarea
                type='text'
                name='planDetails'
                rows='4'
                value={this.state.Compaign.planDetails}
                className={
                  'form-control ' +
                  (this.state.errors.planDetails ? 'is-invalid' : '')
                }
                placeholder=''
                required='required'
                onChange={this.myChangeHandler}
              />

              {this.state.errors.planDetails.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.planDetails}
                  </span>
                </div>
              )}
            </div>
            {/* ------------------------------------------------ */}

            <Dropdown onSelect={this.myChangeHandler}>
              <Dropdown.Toggle variant='info' id='dropdown-basic'>
                Сонгох
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item value='1' name='fundingType'>
                  Option 1
                </Dropdown.Item>
                <Dropdown.Item value='2' name='fundingType'>
                  Option 2
                </Dropdown.Item>
                <Dropdown.Item value='3' name='fundingType'>
                  Option 3
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* ------------------------------------------------ */}
            <div className='form-group'>
              <label htmlFor='password'>Танилцуулах материал</label>
              <textarea
                type='text'
                name='pitchMaterial'
                rows='4'
                value={this.state.Compaign.pitchMaterial}
                className={
                  'form-control ' +
                  (this.state.errors.pitchMaterial ? 'is-invalid' : '')
                }
                placeholder=''
                required='required'
                onChange={this.myChangeHandler}
              />

              {this.state.errors.pitchMaterial.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.pitchMaterial}
                  </span>
                </div>
              )}
            </div>
            {/* ------------------------------------------------ */}
            <div className='form-group'>
              <label htmlFor='password'>Видео линк</label>
              <textarea
                type='text'
                name='videoPath'
                rows='4'
                value={this.state.Compaign.videoPath}
                className={
                  'form-control ' +
                  (this.state.errors.videoPath ? 'is-invalid' : '')
                }
                placeholder=''
                required='required'
                onChange={this.myChangeHandler}
              />

              {this.state.errors.videoPath.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.videoPath}
                  </span>
                </div>
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Зураг </label>
              <ImageUpload
                id='imagePath'
                name='imagePath'
                onInput={this.imageHandler}
                value={this.state.Compaign.imagePath}
                errorText='Please provide an image.'
              />
              {this.state.errors.imagePath.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.imagePath}
                  </span>
                </div>
              )}
            </div>
            <div className='form-group'>
              <button
                style={{ marginRight: '15px' }}
                type='submit'
                className='btn btn-primary'
                disabled={
                  this.state.Compaign.title &&
                  this.state.Compaign.planDetails &&
                  this.state.Compaign.pitchMaterial &&
                  this.state.Compaign.videoPath &&
                  this.state.Compaign.imagePath
                    ? ''
                    : 'disabled'
                }
              >
                Эхлүүлэх
              </button>
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default CreateCompaign
