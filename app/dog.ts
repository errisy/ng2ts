import {Serializable} from '../rpc/serialization';
@Serializable('./app/dog')
export class Dog {
    public Name: string;
    public Test: string = "test property";
}