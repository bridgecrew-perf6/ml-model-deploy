import axios from 'axios';
import { SERVER_URL } from './env.js';

const instance = axios.create({
	baseURL: SERVER_URL
});

export default instance;
