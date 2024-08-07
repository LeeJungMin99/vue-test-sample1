import axios from 'axios'

// 기본 설정을 가진 Axios 인스턴스 생성
const instance = axios.create({
  baseURL: 'https://api.example.com', // 기본 URL 설정
  timeout: 1000, // 요청 타임아웃 설정
  headers: { 'Content-Type': 'application/json' }, // 기본 헤더 설정
})

// 요청 인터셉터 설정
instance.interceptors.request.use(
  config => {
    // 요청 전 처리
    return config
  },
  error => {
    // 요청 에러 처리
    return Promise.reject(error)
  }
)

// 응답 인터셉터 설정
instance.interceptors.response.use(
  response => {
    // 응답 데이터 처리
    return response
  },
  error => {
    // 응답 에러 처리
    return Promise.reject(error)
  }
)

export default instance