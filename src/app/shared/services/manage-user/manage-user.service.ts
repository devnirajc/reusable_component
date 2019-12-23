import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoaderService, AppConfigService } from '@app/core/services';
import { EndPoints } from './../../constants/endPoints';

@Injectable()
export class ManageUserService {
  private _permissions: any = [];
  private _loggedInUserEmail: string;
  private _userPermissions: any = [];
  private getUserDetailsUrl = this.appConfiguration.appConfig.getUserDetailsBaseUrl;

  // API URLS
  private managerBaseUrl = this.appConfiguration.appConfig.manageUserBaseUrl;
  private getPermissionsUrl = `${this.managerBaseUrl}/${EndPoints.manageUserUrlChildUrlPath.viewPermissions}`;
  private getPermissionsByGroupIdUrl = `${this.managerBaseUrl}/${EndPoints.manageUserUrlChildUrlPath.getPermissionsByGroupId}`;
  private postPermissionsOfGroup = `${this.managerBaseUrl}/${EndPoints.manageUserUrlChildUrlPath.postPermissionsOfGroupId}`;
  private getCategoriesUrl = `${this.managerBaseUrl}/${EndPoints.manageUserUrlChildUrlPath.getCategories}/`;
  private getCapabilitiesUrl = `${this.managerBaseUrl}/${EndPoints.manageUserUrlChildUrlPath.getCapabilities}`;
  private groupsUrl = `${this.managerBaseUrl}/${EndPoints.manageUserUrlChildUrlPath.groups}/`;
  private userUrl = `${this.managerBaseUrl}/${EndPoints.manageUserUrlChildUrlPath.users}/`;
  private assignUsersToGroup = `${this.managerBaseUrl}/${EndPoints.manageUserUrlChildUrlPath.assignUsersToGroup}/`;


  get allPermissions(): any {
    return this._permissions;
  }

  set allPermissions(items: any) {
    this._permissions = items;
  }

  get loggedInUserEmail(): any {
    return this._loggedInUserEmail;
  }

  set loggedInUserEmail(val: any) {
    this._loggedInUserEmail = val;
  }

  constructor(private _http: HttpClient, private loaderService: LoaderService, private appConfiguration: AppConfigService) { }

  /**
  * getAllPermissions
  */
  public getAllPermissions = (params, page: number, size: number) => {
    return this._http.get(`${this.getPermissionsUrl}?page=${page}&size=${size}`);
    //return this._http.get(this.getPermissionsUrl);
  }

  /**
  * getCapabilities
  */
  public getCapabilities = () => {
    return this._http.get(`${this.getCapabilitiesUrl}?page=0&size=100`);
  }

  /**
  * getCategories
  */
  public getCategories = () => {
    return this._http.get(this.getCategoriesUrl);
  }

  /**
  * get all permissions with all capabilitties of single group
  */
  public getAllPermissionsOfGroup = (groupId) => {
    const url = `${this.getPermissionsByGroupIdUrl}/${groupId}?page=0&size=100`;
    return this._http.get(url);
  }

  /*
  * Submit Permissions
  */
  public postGroupPermissions = (params) => {
    return this._http.post(this.postPermissionsOfGroup, params);
  }

  /**
  * Update Group 
  */
  public fetchAllGroups = (params, page, size, sort) => {
    let fetchUrl = `${this.groupsUrl}?search=${params}&page=${page}&size=${size}`;
    return this._http.get(fetchUrl);
  }

  /**
  * Create Group 
  */
  public createGroup = (params: any) => {
    return this._http.post(this.groupsUrl, params);
  }

  /**
 * Update Group 
 */
  public updateGroup = (params: any) => {
    return this._http.post(this.groupsUrl, params);
  }

  /**
 * Update Group 
 */
  public getGroupDetails = (id: any) => {
    return this._http.get(this.groupsUrl + '/' + id);
  }

  // public getAllUsers = () => {
  //   return this._http.get(this.userUrl);
  // }

  public getUsersAssignToGroup = (id: any) => {
    return this._http.get(this.groupsUrl + id + '/users');
  }

  /**
 * Create Group 
 */
  public createUser = (params: any) => {
    return this._http.post(this.userUrl, params);
  }

  /** fetch user by ID */
  public fetchUserById = (userId: any) => {
    return this._http.get(`${this.userUrl}/${userId}`);
  }

  public updateUsersForGroup = (userData: any) => {
    return this._http.post(this.assignUsersToGroup, userData);
  }


  /** fetch user by ID */
  public fetchUserBySearchText = (searchText: any, page: any, size: any) => {
    return this._http.get(`${this.userUrl}?search=firstName:${searchText},lastName:${searchText},userId:${searchText},email:${searchText}&page=${page}&&size=${size}`);
  }


  public updateUserById = (params: any) => {
    return this._http.post(this.userUrl, params);
  }

  public fetchGroupsByUserId = (id: any) => {
    return this._http.get(this.userUrl + id + '/groups');
  }

  /** get User Info */
  public getUserInfo = () => {
    return this._http.get(this.getUserDetailsUrl);
  }

  /** get User Info */
  public setAllPermissions = () => {
    return this._http.get(this.getUserDetailsUrl);
  }

   /** fetch user by ID */
   public getLoggedInUserEmail = (userId: any) => {
    return new Promise((resolve, reject) => {
      this.fetchUserById(userId).subscribe((user: any) => {    
        this.loaderService.hide();
        this.loggedInUserEmail = user.data.items.email ? user.data.items.email : '';
        resolve(this.loggedInUserEmail);
      },
      (err) => {
        reject(err);
      })
    })
  }
}
