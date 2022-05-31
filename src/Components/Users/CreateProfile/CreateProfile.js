import Axios from 'axios'
import React, { Component } from 'react'
import ImageUpload from '../../../Containers/ImageUpload/ImageUpload'
import Spinner from '../../../Containers/Spinner/Spinner'
export class CreatePost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Post: {
        id: '',
        companyName: '',
        contactNumber: '',
        address: '',
        registerNumber: '',
        businessType: '',
        companyDescription: '',
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
        companyName: '',
        contactNumber: '',
        address: '',
        registerNumber: '',
        businessType: '',
        companyDescription: '',
        imagePath: '',
      },
    }
    this.mySubmitHandler = this.mySubmitHandler.bind(this)
    this.myChangeHandler = this.myChangeHandler.bind(this)
  }

  componentDidMount() {
    let path = this.props.match.path
    let id = this.props.match.params.id
    if (path === '/profile/edit/:id') {
      this.setState((pre) => ({
        isloading: true,
      }))
      Axios.get('/profile/viewprofile')
        .then((data) => {
          let post = data.data.profile
          this.setState({
            isloading: false,
            Post: {
              ...this.state.Post,
              id: post._id,
              companyName: post.companyName,
              contactNumber: post.contactNumber,
              address: post.address,
              registerNumber: post.registerNumber,
              businessType: post.businessType,
              companyDescription: post.companyDescription,
              imagePath: post.imagePath,
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
  }

  imageHandler = (id, value, isValid) => {
    this.setState({ Post: { ...this.state.Post, [id]: value } }, () => {})
  }

  myChangeHandler = (event) => {
    let nam = event.target?.name
    let val = event.target?.value
    let errors = this.state.errors
    const { name, value } = event.target
    switch (name) {
      case 'companyName':
        if (value.length > 0) {
          errors.companyName =
            value.length < 6 ? 'Title   must be 5 characters long!' : ''
        }

        if (value.length === 0) {
          errors.companyName =
            value.length === 0 ? 'companyName is required!' : ''
        }
        break

      case 'companyDescription':
        if (value.length > 0) {
          errors.bio =
            value.length < 20 ? 'Content  must be 20 characters long!' : ''
        }

        if (value.length === 0) {
          errors.bio = value.length === 0 ? 'Content is required!' : ''
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
      { ...errors, Post: { ...this.state.Post, [nam]: val } },
      () => {}
    )
  }

  mySubmitHandler(e) {
    this.setState((pre) => ({
      isloading: true,
    }))
    let path = this.props.match.path
    let id = this.props.match.params.id

    e.preventDefault()
    let formData
    if (typeof this.state.Post.imagePath === 'object') {
      formData = new FormData()
      formData.append('id', this.state.Post.id)
      formData.append('companyName', this.state.Post.companyName)
      formData.append('contactNumber', this.state.Post.contactNumber)
      formData.append('address', this.state.Post.address)
      formData.append('registerNumber', this.state.Post.registerNumber)
      formData.append('businessType', this.state.Post.businessType)
      formData.append('companyDescription', this.state.Post.companyDescription)
      formData.append(
        'image',
        this.state.Post.imagePath,
        this.state.Post.companyName
      )
    } else {
      formData = {
        id: this.state.Post.id,
        companyName: this.state.Post.companyName,
        contactNumber: this.state.Post.contactNumber,
        address: this.state.Post.address,
        registerNumber: this.state.Post.registerNumber,
        businessType: this.state.Post.businessType,
        companyDescription: this.state.Post.companyDescription,
        image: this.state.Post.imagePath,
      }
    }

    if (path === '/profile/edit/:id') {
      Axios.put('/profile/edit/' + id, formData)
        .then((data) => {
          this.setState((pre) => ({
            isloading: false,
          }))
          this.props.history.push('/profile')
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
      Axios.post('/profile/create', formData)
        .then((data) => {
          this.setState((pre) => ({
            isloading: true,
          }))
          let profile = data.data.profile.companyName
          localStorage.setItem(
            'profileData',
            JSON.stringify({
              companyName: profile,
            })
          )
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
      Post: { ...this.state.Post, companyName: '', bio: '', imagePath: '' },
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
            <h3 className='text-center mb-3'>Компанийн тухай</h3>
            <div className='form-group'>
              <label htmlFor='companyName'>Компанийн нэр</label>
              <input
                type='companyName'
                name='companyName'
                value={this.state.Post.companyName}
                className={
                  'form-control ' +
                  (this.state.errors.companyName ? 'is-invalid' : '')
                }
                placeholder='Enter the companyName'
                required
                onChange={this.myChangeHandler}
              />

              {this.state.errors.companyName.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.companyName}
                  </span>
                </div>
              )}
            </div>
            {/* --------------------------------------------------- */}

            <div className='form-group'>
              <label htmlFor='password'>Холбогдох дугаар </label>
              <textarea
                type='text'
                name='contactNumber'
                rows='4'
                value={this.state.Post.contactNumber}
                className={
                  'form-control ' +
                  (this.state.errors.ContactNumber ? 'is-invalid' : '')
                }
                placeholder='Enter the  description'
                required='required'
                onChange={this.myChangeHandler}
              />

              {this.state.errors.contactNumber.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.contactNumber}
                  </span>
                </div>
              )}
            </div>
            {/* --------------------------------------------------- */}

            <div className='form-group'>
              <label htmlFor='password'>Хаяг </label>
              <textarea
                type='text'
                name='address'
                rows='4'
                value={this.state.Post.address}
                className={
                  'form-control ' +
                  (this.state.errors.address ? 'is-invalid' : '')
                }
                placeholder='Enter the  description'
                required='required'
                onChange={this.myChangeHandler}
              />

              {this.state.errors.address.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.address}
                  </span>
                </div>
              )}
            </div>
            {/* --------------------------------------------------- */}

            <div className='form-group'>
              <label htmlFor='password'>Регистерийн дугаар </label>
              <textarea
                type='text'
                name='registerNumber'
                rows='4'
                value={this.state.Post.registerNumber}
                className={
                  'form-control ' +
                  (this.state.errors.registerNumber ? 'is-invalid' : '')
                }
                placeholder='Enter the  description'
                required='required'
                onChange={this.myChangeHandler}
              />

              {this.state.errors.registerNumber.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.registerNumber}
                  </span>
                </div>
              )}
            </div>
            {/* --------------------------------------------------- */}

            <div className='form-group'>
              <label htmlFor='password'>Үйл ажиллагаа явуулах чиглэл </label>
              <textarea
                type='text'
                name='businessType'
                rows='4'
                value={this.state.Post.businessType}
                className={
                  'form-control ' +
                  (this.state.errors.businessType ? 'is-invalid' : '')
                }
                placeholder='Enter the  description'
                required='required'
                onChange={this.myChangeHandler}
              />

              {this.state.errors.businessType.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.businessType}
                  </span>
                </div>
              )}
            </div>
            {/* --------------------------------------------------- */}

            <div className='form-group'>
              <label htmlFor='password'>Дэлгэрэнгүй тайлбар </label>
              <textarea
                type='text'
                name='companyDescription'
                rows='4'
                value={this.state.Post.companyDescription}
                className={
                  'form-control ' +
                  (this.state.errors.companyDescription ? 'is-invalid' : '')
                }
                placeholder='Enter the  description'
                required='required'
                onChange={this.myChangeHandler}
              />

              {this.state.errors.companyDescription.length > 0 && (
                <div className='mt-1'>
                  <span className='error text-danger'>
                    {this.state.errors.companyDescription}
                  </span>
                </div>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Image </label>
              <ImageUpload
                id='imagePath'
                name='imagePath'
                onInput={this.imageHandler}
                value={this.state.Post.imagePath}
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
                  this.state.Post.companyName &&
                  this.state.Post.contactNumber &&
                  this.state.Post.address &&
                  this.state.Post.registerNumber &&
                  this.state.Post.businessType &&
                  this.state.Post.companyDescription &&
                  this.state.Post.imagePath
                    ? ''
                    : 'disabled'
                }
              >
                Шинэчлэх
              </button>
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default CreatePost
