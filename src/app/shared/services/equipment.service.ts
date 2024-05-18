import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {SchemaSection} from '../model/schema.interface';
import {CreateEquipmentDto, Equipment, EquipmentCategory, EquipmentType} from '../model/equipment.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  rootUrl = environment.url;

  equipment: EquipmentCategory = {
    id: 0,
    equipmentName: '',
    deleteStatus: true,
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  getEquipmentCategory(id: number): Observable<{ data: EquipmentCategory }> {
    return this.http.get<{ data: EquipmentCategory }>(`${this.rootUrl}api/equipment?equipmentId=${id}`);
  }
  getEquipmentCategories(): Observable<{ data: EquipmentCategory[] }> {
    return this.http.get<{ data: EquipmentCategory[] }>(`${this.rootUrl}api/equipment`);
  }

  /* TODO no idea what this is for
      getSingleEquipmentType(id: Number): Observable<any> {
        return this.http.get(`${this.rootUrl}api/equipmentType?equipmentTypeId=${id}`);
      }
   */
  getEquipmentType(categoryId: number): Observable<{ data: EquipmentType[] }> {
    return this.http.get<{ data: EquipmentType[] }>(`${this.rootUrl}api/equipmentTypesByEquipmentId?equipmentId=${categoryId}`);
  }

  getEquipment(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.rootUrl}api/equipmentSubType/${id}`);
  }
  getEquipments(zoneId: number, id: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.rootUrl}api/equipmentSubType?zoneId=${zoneId}&equipmentId=${id}`);
  }
  createEquipment(data: CreateEquipmentDto): Observable<Equipment> {
    return this.http.post<Equipment>(`${this.rootUrl}api/equipmentSubType`, data);
  }
  updateEquipment(data: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.rootUrl}api/equipmentSubType`, data);
  }
  deleteEquipment(id: number): Observable<{ message: string; }> {
    return this.http.delete<{ message: string; }>(`${this.rootUrl}api/equipmentSubType/${id}`);
  }
  duplicateEquipment(zoneId: number, id: number): Observable<Equipment> {
    return this.http.post<Equipment>(`${this.rootUrl}api/equipmentDuplicate`, {
      zoneId,
      subTypeId: id,
    });
  }

  getEquipmentTypeSchema(typeId: number): Observable<SchemaSection[]> {
    return this.http.get<SchemaSection[]>(`${this.rootUrl}api/schema/type/${typeId}/`);
  }
  getEquipmentFormData(id: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentForm?subTypeId=${id}`);
  }
  createEquipmentFormData(equipmentFormData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/equipmentForm`, equipmentFormData);
  }
  updateEquipmentFormData(equipmentFormData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/equipmentForm`, equipmentFormData);
  }
}
