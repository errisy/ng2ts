import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//Client side code for Angualr2

@Injectable()
export class CodeService {
    constructor(private http: Http) {
        console.log('Http service:', http);
    }
    get Code(): Observable<string> {
        return this.http.post('../rpc/demoservice.ts',"").map(this.convertResponse);
    }
    convertResponse(res: Response): string {
        return res.text();
    }
    private listUrl = 'api/dog.js';
}