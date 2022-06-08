import axios from 'axios';

const instance = axios.create({
	baseURL: '' // use relative URL
});

export default instance;
