import type { GeoJSONFeature } from "ol/format/GeoJSON"
import { Map } from 'ol';

export type Task = {
    _id: string,
    name: string,
    createdAt: Date,
    priority: number,
    location: GeoJSONFeature
}

export type Todo = {
    _id: string,
    name: string,
    tasks: Task[]
}

export interface FormData {
    _id: string;
    name: string;
    createdAt: Date;
    priority: number;
    location: GeoJSONFeature;
}

export interface TodoForm {
    _id: string;
    name: string;
    tasks: Task[]
}

export interface UpdateTodoForm {
    name: string;
    task: Task[];
}

export interface DeleteTodoForm {
    todo: string;
}

export interface TaskForm {
    todo: string;
    _id: string;
    name: string;
    createdAt: Date;
    priority: number;
    location: GeoJSONFeature;
}

type ModalProps = {
    open: boolean,
    onClose: () => void
}

export type CreateTaskModalProps = ModalProps;

export type CreateTodoModalProps = ModalProps;

export type DeleteTodoModalProps = ModalProps;

export type UpdateTaskModalProps = ModalProps & {
    task: Task | undefined
}

export type UpdateTodoModalProps = ModalProps & {
    todo: Todo | undefined
}

export type MapViewProps = {
    layers?: any[];
    center?: [number, number];
    zoom?: number;
    onClick?: (coordinate: number[], map: Map) => void;
    height?: string;
    displayTooltip?: boolean;
}

export type PointPickerProps = {
    value: GeoJSONFeature | null,
    onChange: (coords: number[]) => void
}

export type TodoCardProps = {
    todo: Todo,
    setActiveModal: (modalToActivate: string, selectTodo: Todo) => void
}