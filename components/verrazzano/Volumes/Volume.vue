<script>
// Added by Verrazzano
import AwsElasticBlockStore from '@/components/verrazzano/Volumes/AwsElasticBlockStore';
import AzureDisk from '@/components/verrazzano/Volumes/AzureDisk';
import CephFS from '@/components/verrazzano/Volumes/CephFS';
import Cinder from '@/components/verrazzano/Volumes/Cinder';
import ConfigMap from '@/components/verrazzano/Volumes/ConfigMap';
import CSIVolume from '@/components/verrazzano/Volumes/CSIVolume';
import DownwardAPI from '@/components/verrazzano/Volumes/DownwardAPI';
import EmptyDir from '@/components/verrazzano/Volumes/EmptyDir';
import Ephemeral from '@/components/verrazzano/Volumes/Ephemeral';
import FibreChannel from '@/components/verrazzano/Volumes/FibreChannel';
import FlexVolume from '@/components/verrazzano/Volumes/FlexVolume';
import Flocker from '@/components/verrazzano/Volumes/Flocker';
import GCEPersistentDisk from '@/components/verrazzano/Volumes/GCEPersistentDisk';
import GlusterFS from '@/components/verrazzano/Volumes/GlusterFS';
import HostPath from '@/components/verrazzano/Volumes/HostPath';
import ISCSI from '@/components/verrazzano/Volumes/ISCSI';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import NFS from '@/components/verrazzano/Volumes/NFS';
import PhotonPersistentDisk from '@/components/verrazzano/Volumes/PhotonPersistentDisk';
import PortworxVolume from '@/components/verrazzano/Volumes/PortworxVolume';
import ProjectedVolume from '@/components/verrazzano/Volumes/ProjectedVolume';
import PVCVolumeSource from '@/components/verrazzano/Volumes/PVCVolumeSource';
import RadosBlockDevice from '@/components/verrazzano/Volumes/RadosBlockDevice';
import ScaleIO from '@/components/verrazzano/Volumes/ScaleIO';
import Secret from '@/components/verrazzano/Volumes/Secret';
import StorageOS from '@/components/verrazzano/Volumes/StorageOS';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VSphereVolume from '@/components/verrazzano/Volumes/VSphereVolume';

import Vue from 'vue';

import debounce from 'lodash/debounce';

export default {
  name:       'Volume',
  components: {
    AwsElasticBlockStore,
    AzureDisk,
    CephFS,
    Cinder,
    ConfigMap,
    CSIVolume,
    DownwardAPI,
    EmptyDir,
    Ephemeral,
    FibreChannel,
    FlexVolume,
    Flocker,
    GCEPersistentDisk,
    GlusterFS,
    HostPath,
    ISCSI,
    LabeledSelect,
    LabeledInput,
    NFS,
    PhotonPersistentDisk,
    PortworxVolume,
    ProjectedVolume,
    PVCVolumeSource,
    RadosBlockDevice,
    ScaleIO,
    Secret,
    StorageOS,
    VSphereVolume,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    }
  },
  data() {
    const volume = this.clone(this.value);

    volume._type = '';

    return { volume };
  },
  computed: {
    volumeTypeOptions() {
      return [
        {
          value:     'aws',
          label:     this.t('verrazzano.config.values.types.volumeType.aws'),
          fieldName: 'awsElasticBlockStore'
        },
        {
          value:     'azure',
          label:     this.t('verrazzano.config.values.types.volumeType.azure'),
          fieldName: 'azureDisk'
        },
        {
          value: 'cephfs',
          label: this.t('verrazzano.config.values.types.volumeType.cephfs')
        },
        {
          value: 'cinder',
          label: this.t('verrazzano.config.values.types.volumeType.cinder')
        },
        {
          value: 'configMap',
          label: this.t('verrazzano.config.values.types.volumeType.configMap')
        },
        {
          value: 'csi',
          label: this.t('verrazzano.config.values.types.volumeType.csi')
        },
        {
          value:     'downwardApi',
          label:     this.t('verrazzano.config.values.types.volumeType.downwardApi'),
          fieldName: 'downwardAPI'
        },
        {
          value: 'emptyDir',
          label: this.t('verrazzano.config.values.types.volumeType.emptyDir')
        },
        {
          value: 'ephemeral',
          label: this.t('verrazzano.config.values.types.volumeType.ephemeral')
        },
        {
          value: 'fc',
          label: this.t('verrazzano.config.values.types.volumeType.fc')
        },
        {
          value:     'flex',
          label:     this.t('verrazzano.config.values.types.volumeType.flex'),
          fieldName: 'flexVolume'
        },
        {
          value: 'flocker',
          label: this.t('verrazzano.config.values.types.volumeType.flocker')
        },
        {
          value:     'gce',
          label:     this.t('verrazzano.config.values.types.volumeType.gce'),
          fieldName: 'gcePersistentDisk'
        },
        {
          value: 'glusterfs',
          label: this.t('verrazzano.config.values.types.volumeType.glusterfs')
        },
        {
          value: 'hostPath',
          label: this.t('verrazzano.config.values.types.volumeType.hostPath')
        },
        {
          value: 'iscsi',
          label: this.t('verrazzano.config.values.types.volumeType.iscsi')
        },
        {
          value: 'nfs',
          label: this.t('verrazzano.config.values.types.volumeType.nfs')
        },
        {
          value:     'pvc',
          label:     this.t('verrazzano.config.values.types.volumeType.pvc'),
          fieldName: 'persistentVolumeClaim'
        },
        {
          value:     'photon',
          label:     this.t('verrazzano.config.values.types.volumeType.photon'),
          fieldName: 'photonPersistentDisk'
        },
        {
          value:     'portworx',
          label:     this.t('verrazzano.config.values.types.volumeType.postworx'),
          fieldName: 'portworxVolume'
        },
        {
          value: 'projected',
          label: this.t('verrazzano.config.values.types.volumeType.projected')
        },
        {
          value: 'quobyte',
          label: this.t('verrazzano.config.values.types.volumeType.quobyte')
        },
        {
          value: 'rbd',
          label: this.t('verrazzano.config.values.types.volumeType.rbd')
        },
        {
          value: 'scaleIO',
          label: this.t('verrazzano.config.values.types.volumeType.scaleIO')
        },
        {
          value: 'secret',
          label: this.t('verrazzano.config.values.types.volumeType.secret')
        },
        {
          value: 'storageOS',
          label: this.t('verrazzano.config.values.types.volumeType.storageOS')
        },
        {
          value:     'vsphere',
          label:     this.t('verrazzano.config.values.types.volumeType.vsphere'),
          fieldName: 'vsphereVolume'
        },
      ];
    },
    showAws() {
      return this.volume._type === 'aws';
    },
    showAzure() {
      return this.volume._type === 'azure';
    },
    showCephFS() {
      return this.volume._type === 'cephfs';
    },
    showCinder() {
      return this.volume._type === 'cinder';
    },
    showConfigMap() {
      return this.volume._type === 'configMap';
    },
    showCSI() {
      return this.volume._type === 'csi';
    },
    showDownwardAPI() {
      return this.volume._type === 'downwardApi';
    },
    showEmptyDir() {
      return this.volume._type === 'emptyDir';
    },
    showEphemeral() {
      return this.volume._type === 'ephemeral';
    },
    showFC() {
      return this.volume._type === 'fc';
    },
    showFlex() {
      return this.volume._type === 'flex';
    },
    showFlocker() {
      return this.volume._type === 'flocker';
    },
    showGCE() {
      return this.volume._type === 'gce';
    },
    showGlusterFS() {
      return this.volume._type === 'glusterfs';
    },
    showHostPath() {
      return this.volume._type === 'hostPath';
    },
    showIscsi() {
      return this.volume._type === 'iscsi';
    },
    showNFS() {
      return this.volume._type === 'nfs';
    },
    showPVC() {
      return this.volume._type === 'pvc';
    },
    showPhoton() {
      return this.volume._type === 'photon';
    },
    showPostworx() {
      return this.volume._type === 'postworx';
    },
    showProjected() {
      return this.volume._type === 'projected';
    },
    showQuobyte() {
      return this.volume._type === 'quobyte';
    },
    showRBD() {
      return this.volume._type === 'rbd';
    },
    showScaleIO() {
      return this.volume._type === 'scaleIO';
    },
    showSecret() {
      return this.volume._type === 'secret';
    },
    showStorageOS() {
      return this.volume._type === 'storageOS';
    },
    showVsphere() {
      return this.volume._type === 'vsphere';
    },
  },
  methods: {
    update() {
      const volume = this.clone(this.volume);

      delete volume._type;

      this.$emit('input', volume);
    },
    getVolumeType(vol) {
      const fieldName = Object.keys(vol).find((key) => {
        return key !== 'name' && key !== '_type';
      });

      if (!fieldName) {
        return undefined;
      }

      const record = this.volumeTypeOptions.find((type) => {
        const recordFieldName = type.fieldName ? type.fieldName : type.value;

        return fieldName === recordFieldName;
      });

      return record ? record.value : undefined;
    },
    clearVolumeTypeField(volumeType) {
      const field = this.volumeTypeOptions.find(type => type.value === volumeType);

      const fieldName = field.fieldName ? field.fieldName : field.value;

      Vue.delete(this.volume, fieldName);

      this.queueUpdate();
    },
    updateVolumeType(neu) {
      this.queueUpdate();
    },
    setLocalField(fieldName, value) {
      this.set(this.volume, fieldName, value);
      this.queueUpdate();
    },
    setLocalFieldIfNotEmpty(fieldName, value) {
      const valToSet = this.isEmptyValue(fieldName, value) ? undefined : value;

      this.setLocalField(fieldName, valToSet);
    }
  },
  watch: {
    'volume._type'(neu, old) {
      if (old) {
        this.clearVolumeTypeField(old);
      }
    }
  },
  created() {
    this.volume._type = this.getVolumeType(this.volume);

    this.queueUpdate = debounce(this.update, 500);
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="get(volume, 'name')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.name')"
          required
          @input="setLocalField('name', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          v-model="volume._type"
          :mode="mode"
          :options="volumeTypeOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.config.fields.volumes.type')"
          @input="updateVolumeType($event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div v-if="showAws">
      <h4>{{ t('verrazzano.config.titles.volumes.awsElasticBlockStore') }}</h4>
      <AwsElasticBlockStore
        :value="get(volume, 'awsElasticBlockStore')"
        :mode="mode"
        @input="setLocalFieldIfNotEmpty('awsElasticBlockStore', $event)"
      />
      <div class="spacer" />
    </div>
    <div v-else-if="showAzure">
      <h4>{{ t('verrazzano.config.titles.volumes.azureDisk') }}</h4>
      <AzureDisk
        :value="get(volume, 'azureDisk')"
        :mode="mode"
        @input="setLocalFieldIfNotEmpty('azureDisk', $event)"
      />
      <div class="spacer" />
    </div>
    <div v-else-if="showCephFS">
      <h4>{{ t('verrazzano.config.titles.volumes.cephfs') }}</h4>
      <CephFS
        :value="get(volume, 'cephfs')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalFieldIfNotEmpty('cephfs', $event)"
      />
      <div class="spacer" />
    </div>
    <div v-else-if="showCinder">
      <h4>{{ t('verrazzano.config.titles.volumes.cinder') }}</h4>
      <Cinder
        :value="get(volume, 'cinder')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalFieldIfNotEmpty('cinder', $event)"
      />
      <div class="spacer" />
    </div>
    <div v-else-if="showConfigMap">
      <h4>{{ t('verrazzano.config.titles.volumes.configMap') }}</h4>
      <ConfigMap
        :value="get(volume, 'configMap')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalFieldIfNotEmpty('configMap', $event)"
      />
    </div>
    <div v-else-if="showCSI">
      <h4>{{ t('verrazzano.config.titles.volumes.csi') }}</h4>
      <CSIVolume
        :value="get(volume, 'csi')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalFieldIfNotEmpty('csi', $event)"
      />
    </div>
    <div v-else-if="showDownwardAPI">
      <h4>{{ t('verrazzano.config.titles.volumes.downwardApi.title') }}</h4>
      <DownwardAPI
        :value="get(volume, 'downwardAPI')"
        :mode="mode"
        @input="setLocalField('downwardAPI', $event)"
      />
    </div>
    <div v-else-if="showEmptyDir">
      <h4>{{ t('verrazzano.config.titles.volumes.emptyDir') }}</h4>
      <EmptyDir
        :value="get(volume, 'emptyDir')"
        :mode="mode"
        @input="setLocalField('emptyDir', $event)"
      />
    </div>
    <div v-else-if="showEphemeral">
      <h4>{{ t('verrazzano.config.titles.volumes.ephemeral.title') }}</h4>
      <div class="spacer-small" />
      <Ephemeral
        :value="get(volume, 'ephemeral')"
        :mode="mode"
        @input="setLocalField('ephemeral', $event)"
      />
    </div>
    <div v-else-if="showFC">
      <h4>{{ t('verrazzano.config.titles.volumes.fc') }}</h4>
      <FibreChannel
        :value="get(volume, 'fc')"
        :mode="mode"
        @input="setLocalField('fc', $event)"
      />
    </div>
    <div v-else-if="showFlex">
      <h4>{{ t('verrazzano.config.titles.volumes.flex') }}</h4>
      <FlexVolume
        :value="get(volume, 'flexVolume')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('flexVolume', $event)"
      />
    </div>
    <div v-else-if="showFlocker">
      <h4>{{ t('verrazzano.config.titles.volumes.flocker') }}</h4>
      <Flocker
        :value="get(volume, 'flocker')"
        :mode="mode"
        @input="setLocalField('flocker', $event)"
      />
    </div>
    <div v-else-if="showGCE">
      <h4>{{ t('verrazzano.config.titles.volumes.gce') }}</h4>
      <GCEPersistentDisk
        :value="get(volume, 'gcePersistentDisk')"
        :mode="mode"
        @input="setLocalField('gcePersistentDisk', $event)"
      />
    </div>
    <div v-else-if="showGlusterFS">
      <h4>{{ t('verrazzano.config.titles.volumes.glusterfs') }}</h4>
      <GlusterFS
        :value="get(volume, 'glusterfs')"
        :mode="mode"
        @input="setLocalField('glusterfs', $event)"
      />
    </div>
    <div v-else-if="showHostPath">
      <h4>{{ t('verrazzano.config.titles.volumes.hostPath') }}</h4>
      <HostPath
        :value="get(volume, 'hostPath')"
        :mode="mode"
        @input="setLocalField('hostPath', $event)"
      />
    </div>
    <div v-else-if="showIscsi">
      <h4>{{ t('verrazzano.config.titles.volumes.iscsi') }}</h4>
      <ISCSI
        :value="get(volume, 'iscsi')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('iscsi', $event)"
      />
    </div>
    <div v-else-if="showNFS">
      <h4>{{ t('verrazzano.config.titles.volumes.nfs') }}</h4>
      <NFS
        :value="get(volume, 'nfs')"
        :mode="mode"
        @input="setLocalField('nfs', $event)"
      />
    </div>
    <div v-else-if="showPVC">
      <h4>{{ t('verrazzano.config.titles.volumes.pvc') }}</h4>
      <PVCVolumeSource
        :value="get(volume, 'persistentVolumeClaim')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('persistentVolumeClaim', $event)"
      />
    </div>
    <div v-else-if="showPhoton">
      <h4>{{ t('verrazzano.config.titles.volumes.photon') }}</h4>
      <PhotonPersistentDisk
        :value="get(volume, 'photonPersistentDisk')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('photonPersistentDisk', $event)"
      />
    </div>
    <div v-else-if="showPostworx">
      <h4>{{ t('verrazzano.config.titles.volumes.portworx') }}</h4>
      <PortworxVolume
        :value="get(volume, 'portworxVolume')"
        :mode="mode"
        @input="setLocalField('portworxVolume', $event)"
      />
    </div>
    <div v-else-if="showProjected">
      <h4>{{ t('verrazzano.config.titles.volumes.projected.title') }}</h4>
      <ProjectedVolume
        :value="get(volume, 'projected')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('projected', $event)"
      />
    </div>
    <div v-else-if="showQuobyte">
      <h4>{{ t('verrazzano.config.titles.volumes.quobyte') }}</h4>
      <PortworxVolume
        :value="get(volume, 'quobyte')"
        :mode="mode"
        @input="setLocalField('quobyte', $event)"
      />
    </div>
    <div v-else-if="showRBD">
      <h4>{{ t('verrazzano.config.titles.volumes.rbd') }}</h4>
      <RadosBlockDevice
        :value="get(volume, 'rbd')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('rbd', $event)"
      />
    </div>
    <div v-else-if="showScaleIO">
      <h4>{{ t('verrazzano.config.titles.volumes.scaleIO') }}</h4>
      <ScaleIO
        :value="get(volume, 'scaleIO')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('scaleIO', $event)"
      />
    </div>
    <div v-else-if="showSecret">
      <h4>{{ t('verrazzano.config.titles.volumes.secret') }}</h4>
      <Secret
        :value="get(volume, 'secret')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('secret', $event)"
      />
    </div>
    <div v-else-if="showStorageOS">
      <h4>{{ t('verrazzano.config.titles.volumes.storageOS') }}</h4>
      <StorageOS
        :value="get(volume, 'storageos')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setLocalField('storageos', $event)"
      />
    </div>
    <div v-else-if="showVsphere">
      <h4>{{ t('verrazzano.config.titles.volumes.vsphere') }}</h4>
      <VSphereVolume
        :value="get(volume, 'vsphereVolume')"
        :mode="mode"
        @input="setLocalField('vsphereVolume', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
