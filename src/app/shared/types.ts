export interface restriction {
    start: string;
    end: string;
    days: string;
}

export interface point {
    lat: number;
    long: number;
    restrict: restriction;
}

export interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    url: string;
    opacity: number;
}