<script>
import LabeledSelect from '@/components/form/LabeledSelect';
import NodeSelectorTerm from '@/components/verrazzano/NodeSelectorTerm';
import PodAffinityTerm from '@/components/verrazzano/PodAffinityTerm';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'AffinityTab',
  components: {
    LabeledSelect,
    NodeSelectorTerm,
    PodAffinityTerm,
    TabDeleteButton,
    TreeTab,
  },
  inject: ['selectTab'],
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
    tabName: {
      type:     String,
      default:  '',
      required: true
    },
    tabLabel: {
      type:     String,
      default:  '',
    },
  },
  data() {
    let preferredDuringSchedulingIgnoredDuringExecution = this.value.nodeAffinity?.preferredDuringSchedulingIgnoredDuringExecution || [];
    let requiredDuringSchedulingIgnoredDuringExecution = this.value.nodeAffinity?.requiredDuringSchedulingIgnoredDuringExecution || {};

    // The actual term object is in the preference field of the term
    const allNodePreferredSelectorTerms = preferredDuringSchedulingIgnoredDuringExecution.map((term) => {
      const newTerm = this.clone(term);

      newTerm._id = randomStr(4);
      if (typeof newTerm.weight === 'undefined') {
        newTerm.weight = 1;
      }

      return newTerm;
    });

    const allNodeRequiredSelectorTerms = (requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms || []).map((term) => {
      const newTerm = this.clone(term);

      newTerm._id = randomStr(4);

      return newTerm;
    });

    preferredDuringSchedulingIgnoredDuringExecution = this.value.podAffinity?.preferredDuringSchedulingIgnoredDuringExecution || [];
    requiredDuringSchedulingIgnoredDuringExecution = this.value.podAffinity?.requiredDuringSchedulingIgnoredDuringExecution || [];

    // The actual term object is in the podAffinityTerm field of the term
    const allPodPreferredSelectorTerms = preferredDuringSchedulingIgnoredDuringExecution.map((term) => {
      const newTerm = this.clone(term);

      newTerm._id = randomStr(4);

      return newTerm;
    });

    const allPodRequiredSelectorTerms = requiredDuringSchedulingIgnoredDuringExecution.map((term) => {
      const newTerm = this.clone(term);

      newTerm._id = randomStr(4);

      return newTerm;
    });

    preferredDuringSchedulingIgnoredDuringExecution = this.value.podAntiAffinity?.preferredDuringSchedulingIgnoredDuringExecution || [];
    requiredDuringSchedulingIgnoredDuringExecution = this.value.podAntiAffinity?.requiredDuringSchedulingIgnoredDuringExecution || [];

    // The actual term object is in the podAffinityTerm field of the term
    const allPodAntiPreferredSelectorTerms = preferredDuringSchedulingIgnoredDuringExecution.map((term) => {
      const newTerm = this.clone(term);

      newTerm._id = randomStr(4);

      return newTerm;
    });

    const allPodAntiRequiredSelectorTerms = requiredDuringSchedulingIgnoredDuringExecution.map((term) => {
      const newTerm = this.clone(term);

      newTerm._id = randomStr(4);

      return newTerm;
    });

    return {
      treeTabName:         this.tabName,
      treeTabLabel:        this.tabLabel,
      newAffinityType:     '',
      newSelectorTermType: '',
      allNodePreferredSelectorTerms,
      allNodeRequiredSelectorTerms,
      allPodPreferredSelectorTerms,
      allPodRequiredSelectorTerms,
      allPodAntiPreferredSelectorTerms,
      allPodAntiRequiredSelectorTerms,
    };
  },
  computed: {
    affinityTypeOptions() {
      return [
        { value: 'nodeAffinity', label: this.t('verrazzano.common.types.affinityType.nodeAffinity') },
        { value: 'podAffinity', label: this.t('verrazzano.common.types.affinityType.podAffinity') },
        { value: 'podAntiAffinity', label: this.t('verrazzano.common.types.affinityType.podAntiAffinity') },
      ];
    },
    selectorTermTypeOptions() {
      return [
        { value: 'preferred', label: this.t('verrazzano.common.types.selectorTermType.preferred') },
        { value: 'required', label: this.t('verrazzano.common.types.selectorTermType.required') },
      ];
    },
    allNodeSelectorTerms() {
      return [...this.allNodePreferredSelectorTerms, ...this.allNodeRequiredSelectorTerms];
    },
    allPodSelectorTerms() {
      return [...this.allPodPreferredSelectorTerms, ...this.allPodRequiredSelectorTerms];
    },
    allPodAntiSelectorTerms() {
      return [...this.allPodAntiPreferredSelectorTerms, ...this.allPodAntiRequiredSelectorTerms];
    },
    showNodeAffinityTab() {
      return this.allNodePreferredSelectorTerms.length > 0 || this.allNodeRequiredSelectorTerms.length > 0;
    },
    showPodAffinityTab() {
      return this.allPodPreferredSelectorTerms.length > 0 || this.allPodRequiredSelectorTerms.length > 0;
    },
    showPodAntiAffinityTab() {
      return this.allPodAntiPreferredSelectorTerms.length > 0 || this.allPodAntiRequiredSelectorTerms.length > 0;
    },
  },
  methods: {
    _updateCloneHelper(allTerms, terms) {
      allTerms.forEach((term) => {
        const newTerm = this.clone(term);

        delete newTerm._id;

        terms.push(newTerm);
      });
    },
    _updateSetHelper(baseFieldName, prefFieldName, reqFieldName, prefArray, reqArray) {
      if (prefArray.length > 0) {
        this.setFieldIfNotEmpty(`${ baseFieldName }.${ prefFieldName }`, prefArray);
      } else {
        const fieldNameToSet = prefFieldName.includes('.') ? prefFieldName.split('.')[0] : prefFieldName;

        this.setField(`${ baseFieldName }.${ fieldNameToSet }`, undefined);
      }
      if (reqArray.length > 0) {
        this.setFieldIfNotEmpty(`${ baseFieldName }.${ reqFieldName }`, reqArray);
      } else {
        const fieldNameToSet = reqFieldName.includes('.') ? reqFieldName.split('.')[0] : reqFieldName;

        this.setField(`${ baseFieldName }.${ fieldNameToSet }`, undefined);
      }
      if (prefArray.length === 0 && reqArray.length === 0) {
        this.setField(baseFieldName, undefined);
      }
    },
    update() {
      const nodePreferred = [];
      const nodeRequired = { nodeSelectorTerms: [] };
      const podPreferred = [];
      const podRequired = [];
      const antiPodPreferred = [];
      const antiPodRequired = [];

      this._updateCloneHelper(this.allNodePreferredSelectorTerms, nodePreferred);
      this._updateCloneHelper(this.allNodeRequiredSelectorTerms, nodeRequired.nodeSelectorTerms);
      this._updateCloneHelper(this.allPodPreferredSelectorTerms, podPreferred);
      this._updateCloneHelper(this.allPodRequiredSelectorTerms, podRequired);
      this._updateCloneHelper(this.allPodAntiPreferredSelectorTerms, antiPodPreferred);
      this._updateCloneHelper(this.allPodAntiRequiredSelectorTerms, antiPodRequired);

      this._updateSetHelper('nodeAffinity', 'preferredDuringSchedulingIgnoredDuringExecution',
        'requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms', nodePreferred, nodeRequired.nodeSelectorTerms);
      this._updateSetHelper('podAffinity', 'preferredDuringSchedulingIgnoredDuringExecution',
        'requiredDuringSchedulingIgnoredDuringExecution', podPreferred, podRequired);
      this._updateSetHelper('podAntiAffinity', 'preferredDuringSchedulingIgnoredDuringExecution',
        'requiredDuringSchedulingIgnoredDuringExecution', antiPodPreferred, antiPodRequired);
    },
    addNodeAffinityPreferredTerm() {
      this.allNodePreferredSelectorTerms.push({
        _id:        randomStr(4),
        weight:     1,
        preference: {}
      });
      this.selectTab(this.getNodeSelectorTermTabName(this.allNodePreferredSelectorTerms.length - 1));
    },
    addNodeAffinityRequiredTerm() {
      this.allNodeRequiredSelectorTerms.push({ _id: randomStr(4) });
      this.selectTab(this.getNodeSelectorTermTabName(this.allNodeRequiredSelectorTerms.length +
          this.allNodePreferredSelectorTerms.length - 1));
    },
    addPodAffinityPreferredTerm() {
      this.allPodPreferredSelectorTerms.push({
        _id:             randomStr(4),
        weight:          1,
        podAffinityTerm: {}
      });
      this.selectTab(this.getPodSelectorTermTabName(this.allPodPreferredSelectorTerms.length - 1));
    },
    addPodAffinityRequiredTerm() {
      this.allPodRequiredSelectorTerms.push({ _id: randomStr(4) });
      this.selectTab(this.getPodSelectorTermTabName(this.allPodRequiredSelectorTerms.length +
          this.allPodPreferredSelectorTerms.length - 1));
    },
    addPodAntiAffinityPreferredTerm() {
      this.allPodAntiPreferredSelectorTerms.push({
        _id:             randomStr(4),
        weight:          1,
        podAffinityTerm: {}
      });
      this.selectTab(this.getPodAntiSelectorTermTabName(this.allPodAntiPreferredSelectorTerms.length - 1));
    },
    addPodAntiAffinityRequiredTerm() {
      this.allPodAntiRequiredSelectorTerms.push({ _id: randomStr(4) });
      this.selectTab(this.getPodAntiSelectorTermTabName(this.allPodAntiRequiredSelectorTerms.length +
          this.allPodAntiPreferredSelectorTerms.length - 1));
    },
    addNodeAffinityTerm(type) {
      if (type || this.newSelectorTermType) {
        if (!type) {
          type = this.newSelectorTermType;
        }
        const addMethod = type === 'preferred' ? this.addNodeAffinityPreferredTerm : this.addNodeAffinityRequiredTerm;

        addMethod();
      }
    },
    addPodAffinityTerm(type) {
      if (type || this.newSelectorTermType) {
        if (!type) {
          type = this.newSelectorTermType;
        }
        const addMethod = type === 'preferred' ? this.addPodAffinityPreferredTerm : this.addPodAffinityRequiredTerm;

        addMethod();
      }
    },
    addPodAntiAffinityTerm(type = null) {
      if (type || this.newSelectorTermType) {
        if (!type) {
          type = this.newSelectorTermType;
        }
        const addMethod = type === 'preferred' ? this.addPodAntiAffinityPreferredTerm : this.addPodAntiAffinityRequiredTerm;

        addMethod();
      }
    },
    addAffinityTerm() {
      if (this.newAffinityType && this.newSelectorTermType) {
        switch (this.newAffinityType) {
        case 'nodeAffinity':
          this.addNodeAffinityTerm(this.newSelectorTermType);
          break;

        case 'podAffinity':
          this.addPodAffinityTerm(this.newSelectorTermType);
          break;

        case 'podAntiAffinity':
          this.addPodAntiAffinityTerm(this.newSelectorTermType);
          break;
        }
      }
    },
    _isPreferredType(affinityType, index) {
      let list;

      switch (affinityType) {
      case 'nodeAffinity':
        list = this.allNodePreferredSelectorTerms;
        break;

      case 'podAffinity':
        list = this.allPodPreferredSelectorTerms;
        break;

      case 'podAntiAffinity':
        list = this.allPodAntiPreferredSelectorTerms;
        break;
      }

      return index < list.length;
    },
    getNodeSelectorTermTabName(index) {
      const prefix = this._isPreferredType('nodeAffinity', index) ? 'preferred' : 'required';
      const effectiveIndex = prefix === 'preferred' ? index : index - this.allNodePreferredSelectorTerms.length;

      return this.createTabKey(this.createTabKey(this.treeTabName, 'nodeAffinity'), `${ prefix }${ effectiveIndex + 1 }`);
    },
    getNodeSelectorTermTabLabel(index) {
      let key;
      let effectiveIndex;

      if (this._isPreferredType('nodeAffinity', index)) {
        key = 'verrazzano.common.tabs.nodePreferredSelectorTerm';
        effectiveIndex = index;
      } else {
        key = 'verrazzano.common.tabs.nodeRequiredSelectorTerm';
        effectiveIndex = index - this.allNodePreferredSelectorTerms.length;
      }

      return this.t(key, { index: effectiveIndex + 1 });
    },
    getPodSelectorTermTabName(index) {
      const prefix = this._isPreferredType('podAffinity', index) ? 'preferred' : 'required';
      const effectiveIndex = prefix === 'preferred' ? index : index - this.allPodPreferredSelectorTerms.length;

      return this.createTabKey(this.createTabKey(this.treeTabName, 'podAffinity'), `${ prefix }${ effectiveIndex + 1 }`);
    },
    getPodSelectorTermTabLabel(index) {
      let key;
      let effectiveIndex;

      if (this._isPreferredType('podAffinity', index)) {
        key = 'verrazzano.common.tabs.podPreferredSelectorTerm';
        effectiveIndex = index;
      } else {
        key = 'verrazzano.common.tabs.podRequiredSelectorTerm';
        effectiveIndex = index - this.allPodPreferredSelectorTerms.length;
      }

      return this.t(key, { index: effectiveIndex + 1 });
    },
    getPodAntiSelectorTermTabName(index) {
      const prefix = this._isPreferredType('podAntiAffinity', index) ? 'preferred' : 'required';
      const effectiveIndex = prefix === 'preferred' ? index : index - this.allPodAntiPreferredSelectorTerms.length;

      return this.createTabKey(this.createTabKey(this.treeTabName, 'podAntiAffinity'), `${ prefix }${ effectiveIndex + 1 }`);
    },
    getPodAntiSelectorTermTabLabel(index) {
      let key;
      let effectiveIndex;

      if (this._isPreferredType('podAntiAffinity', index)) {
        key = 'verrazzano.common.tabs.podAntiPreferredSelectorTerm';
        effectiveIndex = index;
      } else {
        key = 'verrazzano.common.tabs.podAntiRequiredSelectorTerm';
        effectiveIndex = index - this.allPodAntiPreferredSelectorTerms.length;
      }

      return this.t(key, { index: effectiveIndex + 1 });
    },
    getValueForNodeSelectorTermComponent(term) {
      return term.weight ? term.preference : term;
    },
    getValueForPodAffinityTermComponent(term) {
      return term.weight ? term.podAffinityTerm : term;
    },
    removeAffinity() {
      this.allNodePreferredSelectorTerms.length = 0;
      this.allNodeRequiredSelectorTerms.length = 0;
      this.allPodPreferredSelectorTerms.length = 0;
      this.allPodRequiredSelectorTerms.length = 0;
      this.allPodAntiPreferredSelectorTerms.length = 0;
      this.allPodAntiRequiredSelectorTerms.length = 0;
      this.queueUpdate();
    },
    removeNodeAffinity() {
      this.allNodePreferredSelectorTerms.length = 0;
      this.allNodeRequiredSelectorTerms.length = 0;
      this.queueUpdate();
    },
    removePodAffinity() {
      this.allPodPreferredSelectorTerms.length = 0;
      this.allPodRequiredSelectorTerms.length = 0;
      this.queueUpdate();
    },
    removePodAntiAffinity() {
      this.allPodAntiPreferredSelectorTerms.length = 0;
      this.allPodAntiRequiredSelectorTerms.length = 0;
      this.queueUpdate();
    },
    removeNodeSelectorTerm(term, index) {
      if (this._isPreferredType('nodeAffinity', index)) {
        this.allNodePreferredSelectorTerms.splice(index, 1);
      } else {
        const effectiveIndex = index - this.allNodePreferredSelectorTerms.length;

        this.allNodeRequiredSelectorTerms.splice(effectiveIndex, 1);
      }
      this.queueUpdate();
    },
    removePodSelectorTerm(term, index) {
      if (this._isPreferredType('podAffinity', index)) {
        this.allPodPreferredSelectorTerms.splice(index, 1);
      } else {
        const effectiveIndex = index - this.allPodPreferredSelectorTerms.length;

        this.allPodRequiredSelectorTerms.splice(effectiveIndex, 1);
      }
      this.queueUpdate();
    },
    removePodAntiSelectorTerm(term, index) {
      if (this._isPreferredType('podAntiAffinity', index)) {
        this.allPodAntiPreferredSelectorTerms.splice(index, 1);
      } else {
        const effectiveIndex = index - this.allPodAntiPreferredSelectorTerms.length;

        this.allPodAntiRequiredSelectorTerms.splice(effectiveIndex, 1);
      }
      this.queueUpdate();
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.affinity');
    }

    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="t('verrazzano.common.tabs.affinity')"
        :mode="mode"
        @click="removeAffinity()"
      />
    </template>
    <template #default>
      <div class="row">
        <div class="col span-4">
          <LabeledSelect
            v-model="newAffinityType"
            :mode="mode"
            required
            :options="affinityTypeOptions"
            option-key="value"
            option-label="label"
            :label="t('verrazzano.common.fields.newAffinityType')"
          />
        </div>
        <div class="col span-4">
          <LabeledSelect
            v-model="newSelectorTermType"
            :mode="mode"
            required
            :options="selectorTermTypeOptions"
            option-key="value"
            option-label="label"
            :label="t('verrazzano.common.fields.newAffinityType')"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-4">
          <button
            type="button"
            :disabled="isView"
            class="btn role-tertiary add"
            @click="addAffinityTerm()"
          >
            {{ t('verrazzano.common.buttons.addAffinitySelectorTerm') }}
          </button>
        </div>
      </div>
    </template>
    <template #nestedTabs>
      <TreeTab v-if="showNodeAffinityTab" :name="createTabKey(treeTabName, 'nodeAffinity')" :label="t('verrazzano.common.tabs.nodeAffinity')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.nodeAffinity')"
            :mode="mode"
            @click="removeNodeAffinity()"
          />
        </template>
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledSelect
                v-model="newSelectorTermType"
                :mode="mode"
                required
                :options="selectorTermTypeOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.common.fields.newAffinityType')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <button
                type="button"
                :disabled="isView"
                class="btn role-tertiary add"
                @click="addNodeAffinityTerm()"
              >
                {{ t('verrazzano.common.buttons.addNodeSelectorTerm') }}
              </button>
            </div>
          </div>
        </template>
        <template #nestedTabs>
          <TreeTab
            v-for="(term, idx) in allNodeSelectorTerms"
            :key="term._id"
            :name="getNodeSelectorTermTabName(idx)"
            :label="getNodeSelectorTermTabLabel(idx)"
          >
            <template #beside-header>
              <TabDeleteButton
                :element-name="getNodeSelectorTermTabLabel(idx)"
                mode="mode"
                @click="removeNodeSelectorTerm(term, idx)"
              />
            </template>
            <template #default>
              <NodeSelectorTerm
                :value="getValueForNodeSelectorTermComponent(term)"
                :mode="mode"
                @input="queueUpdate"
              />
            </template>
          </TreeTab>
        </template>
      </TreeTab>
      <TreeTab v-if="showPodAffinityTab" :name="createTabKey(treeTabName, 'podAffinity')" :label="t('verrazzano.common.tabs.podAffinity')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.podAffinity')"
            :mode="mode"
            @click="removePodAffinity()"
          />
        </template>
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledSelect
                v-model="newSelectorTermType"
                :mode="mode"
                required
                :options="selectorTermTypeOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.common.fields.newAffinityType')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <button
                type="button"
                :disabled="isView"
                class="btn role-tertiary add"
                @click="addPodAffinityTerm()"
              >
                {{ t('verrazzano.common.buttons.addPodSelectorTerm') }}
              </button>
            </div>
          </div>
        </template>
        <template #nestedTabs>
          <TreeTab
            v-for="(term, idx) in allPodSelectorTerms"
            :key="idx"
            :name="getPodSelectorTermTabName(idx)"
            :label="getPodSelectorTermTabLabel(idx)"
          >
            <template #beside-header>
              <TabDeleteButton
                :element-name="getPodSelectorTermTabLabel(idx)"
                mode="mode"
                @click="removePodSelectorTerm(term, idx)"
              />
            </template>
            <template #default>
              <PodAffinityTerm
                :value="getValueForPodAffinityTermComponent(term)"
                :mode="mode"
                @input="queueUpdate"
              />
            </template>
          </TreeTab>
        </template>
      </TreeTab>
      <TreeTab v-if="showPodAntiAffinityTab" :name="createTabKey(treeTabName, 'podAntiAffinity')" :label="t('verrazzano.common.tabs.podAntiAffinity')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.podAntiAffinity')"
            :mode="mode"
            @click="removePodAntiAffinity()"
          />
        </template>
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledSelect
                v-model="newSelectorTermType"
                :mode="mode"
                required
                :options="selectorTermTypeOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.common.fields.newAffinityType')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div class="row">
            <div class="col span-4">
              <button
                type="button"
                :disabled="isView"
                class="btn role-tertiary add"
                @click="addPodAntiAffinityTerm()"
              >
                {{ t('verrazzano.common.buttons.addPodSelectorTerm') }}
              </button>
            </div>
          </div>
        </template>
        <template #nestedTabs>
          <TreeTab
            v-for="(term, idx) in allPodAntiSelectorTerms"
            :key="idx"
            :name="getPodAntiSelectorTermTabName(idx)"
            :label="getPodAntiSelectorTermTabLabel(idx)"
          >
            <template #beside-header>
              <TabDeleteButton
                :element-name="getPodAntiSelectorTermTabLabel(idx)"
                mode="mode"
                @click="removePodAntiSelectorTerm(term, idx)"
              />
            </template>
            <template #default>
              <PodAffinityTerm
                :value="getValueForPodAffinityTermComponent(term)"
                :mode="mode"
                @input="queueUpdate"
              />
            </template>
          </TreeTab>
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
