import axios from 'axios';
import { SERVER_URL } from './env.js';

var baseUrl = process.env.baseURL || SERVER_URL
const instance = axios.create({
	baseURL: baseUrl
});

export default instance;
