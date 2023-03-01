import { createRoomUsecase } from '../usecases/createRoom';
import { joinRoomUsecase } from '../usecases/joinRoom';
import { leaveRoomUsecase } from '../usecases/leaveRoom';
import { loadRoomDataUsecase } from '../usecases/loadData';
import { receiveDataUsecase } from '../usecases/receiveData';
import { BaseController } from './BaseController';

export class BoardController extends BaseController {
  protected routes = [
    { path: 'join', method: joinRoomUsecase },
    { path: 'create', method: createRoomUsecase },
    { path: 'leave', method: leaveRoomUsecase },
    { path: 'sendData', method: receiveDataUsecase },
    { path: 'loadData', method: loadRoomDataUsecase },
  ];
}
