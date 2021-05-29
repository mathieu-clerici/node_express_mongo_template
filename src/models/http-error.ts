/* eslint-disable no-mixed-spaces-and-tabs */
class HttpError extends Error{
    code: number;

    constructor(errorCode: number, message : string){
    	super(message);
    	this.code = errorCode;
    }
}

export default HttpError;