// Added by Verrazzano
import { base64Decode, base64Encode } from '@/utils/crypto';
import OamComponentHelper from '@/mixins/verrazzano/oam-component-helper';

export const TYPES = {
  OPAQUE:           'Opaque',
  SERVICE_ACCT:     'kubernetes.io/service-account-token',
  DOCKER:           'kubernetes.io/dockercfg',
  DOCKER_JSON:      'kubernetes.io/dockerconfigjson',
  BASIC:            'kubernetes.io/basic-auth',
  SSH:              'kubernetes.io/ssh-auth',
  TLS:              'kubernetes.io/tls',
  BOOTSTRAP:        'bootstrap.kubernetes.io/token',
  ISTIO_TLS:        'istio.io/key-and-cert',
  HELM_RELEASE:     'helm.sh/release.v1',
  FLEET_CLUSTER:    'fleet.cattle.io/cluster-registration-values',
  CLOUD_CREDENTIAL: 'provisioning.cattle.io/cloud-credential',
  RKE_AUTH_CONFIG:  'rke.cattle.io/auth-config'
};

export default {
  mixins: [OamComponentHelper],

  computed: {

    decodedData() {
      const out = {};

      for ( const k in this.getWorkloadField('data') || {} ) {
        out[k] = base64Decode(this.getWorkloadField('data')[k]);
      }

      return out;
    },

    setData() {
      return (key, value) => { // or (mapOfNewData)
        const isMap = key && typeof key === 'object';

        let data = this.getWorkloadField('data');

        if ( !data || isMap ) {
          data = {};
        }

        let neu;

        if ( isMap ) {
          neu = key;
        } else {
          neu = { [key]: value };
        }

        for ( const k in neu ) {
        // The key is quoted so that keys like '.dockerconfigjson' that contain dot don't get parsed into an object path
          data[k] = base64Encode(neu[k]);
        }

        this.setWorkloadFieldIfNotEmpty('data', data);
      };
    },

  }
};
