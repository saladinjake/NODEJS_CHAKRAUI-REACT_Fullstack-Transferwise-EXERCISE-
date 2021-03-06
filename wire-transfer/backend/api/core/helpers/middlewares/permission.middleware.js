import Joi from 'joi';
import ResponseApi from '../ResponseApi';
import AccountService from '../../repositories/services/account.service';
import TransactionService from '../../repositories/services/transaction.service';

const response = new ResponseApi();

export default class PermissionMiddleware {
  
  static async strictAccountPermission(req, res, next) {
    if (!req.token) {
      return response.sendError(
        res,
        419,
        'Permission denied',
      );
    }
    const { id, type } = req.token;
    const { accountNumber } = req.params;

    try {
      const isMyAccount = await AccountService.isMyAccount(id, accountNumber);
      console.log(id,type,isMyAccount)
      //its automated it dont have to be your account to credit another account
      if ( //!isMyAccount &&
       (type !== 'client' || type !== 'staff')) {
          
        return response.sendError(res, 403, 'Permission denied');
      }
      return next();
    } catch (error) {
        console.log(error)
      return response.sendError(res, 400, error.message);
    }
  }

  static async strictTransactionPermission(req, res, next) {
    if (!req.token) {
      return response.sendError(
        res,
        419,
        'Permission denied',
      );
    }
    const { id, type } = req.token;
    const { transactionId } = req.params;

    try {
      const transaction = await TransactionService.getTransaction(transactionId);

      const isMyAccount = transaction.owner === id;

      if (!isMyAccount && type !== 'client') {
          console.log(error)
        return response.sendError(res, 403, 'Permission denied');
      }
      return next();
    } catch (error) {
      console.log(error)
      return response.sendError(res, 400, error.message);
    }
  }


  static adminPermission(req, res, next) {
    if (!req.token) {
      return response.sendError(
        res,
        419,
        'unauthorized access',
      );
    }
    const { isAdmin } = req.token;

    if (!isAdmin) {
      return response.sendError(res, 403, 'Admin authentication required');
    }
    return next();
  }



  
  
}
