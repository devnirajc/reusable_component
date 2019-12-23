import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
declare var $ : any;

@Injectable()
export class ModalService {
    public initialize = new BehaviorSubject(true);
    
    openModal(id) {
        this.initialize.next(true);
        $('#'+id).modal({'backdrop' : 'static'});
    }
    
    closeModal(id) {
        this.initialize.next(false);
        $('#'+id).modal('hide');
    }

    setInitialize(value){
        this.initialize.next(value);
    }
}