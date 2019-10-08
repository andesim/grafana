import _ from 'lodash';
import coreModule from '../../core/core_module';
import { BackendSrv } from '@grafana/runtime';
import { NavModelSrv } from 'app/core/nav_model_srv';
import { showConfirmModal } from 'app/types';
import { alertSuccess, alertError } from '@grafana/data';

export class PlaylistsCtrl {
  playlists: any;
  navModel: any;

  /** @ngInject */
  constructor(private $scope: any, private backendSrv: BackendSrv, navModelSrv: NavModelSrv) {
    this.navModel = navModelSrv.getNav('dashboards', 'playlists', 0);

    backendSrv.get('/api/playlists').then((result: any) => {
      this.playlists = result.map((item: any) => {
        item.startUrl = `playlists/play/${item.id}`;
        return item;
      });
    });
  }

  removePlaylistConfirmed(playlist: any) {
    _.remove(this.playlists, { id: playlist.id });

    this.backendSrv.delete('/api/playlists/' + playlist.id).then(
      () => {
        this.$scope.appEvent(alertSuccess, ['Playlist deleted']);
      },
      () => {
        this.$scope.appEvent(alertError, ['Unable to delete playlist']);
        this.playlists.push(playlist);
      }
    );
  }

  removePlaylist(playlist: any) {
    this.$scope.appEvent(showConfirmModal, {
      title: 'Delete',
      text: 'Are you sure you want to delete playlist ' + playlist.name + '?',
      yesText: 'Delete',
      icon: 'fa-trash',
      onConfirm: () => {
        this.removePlaylistConfirmed(playlist);
      },
    });
  }
}

coreModule.controller('PlaylistsCtrl', PlaylistsCtrl);
