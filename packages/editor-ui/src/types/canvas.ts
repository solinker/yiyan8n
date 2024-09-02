/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import type {
	ExecutionStatus,
	INodeConnections,
	IConnection,
	NodeConnectionType,
} from 'n8n-workflow';
import type { DefaultEdge, Node, NodeProps, Position } from '@vue-flow/core';
import type { IExecutionResponse, INodeUi } from '@/Interface';
import type { Ref } from 'vue';
import type { PartialBy } from '@/utils/typeHelpers';
import type { EventBus } from 'n8n-design-system';

export type CanvasConnectionPortType = NodeConnectionType;

export const enum CanvasConnectionMode {
	Input = 'inputs',
	Output = 'outputs',
}

export const canvasConnectionModes = [
	CanvasConnectionMode.Input,
	CanvasConnectionMode.Output,
] as const;

export type CanvasConnectionPort = {
	type: CanvasConnectionPortType;
	required?: boolean;
	index: number;
	label?: string;
};

export interface CanvasElementPortWithRenderData extends CanvasConnectionPort {
	handleId: string;
	isConnected: boolean;
	isConnecting: boolean;
	position: Position;
	offset?: { top?: string; left?: string };
}

export const enum CanvasNodeRenderType {
	Default = 'default',
	StickyNote = 'n8n-nodes-base.stickyNote',
	AddNodes = 'n8n-nodes-internal.addNodes',
}

export type CanvasNodeDefaultRenderLabelSize = 'small' | 'medium' | 'large';

export type CanvasNodeDefaultRender = {
	type: CanvasNodeRenderType.Default;
	options: Partial<{
		configurable: boolean;
		configuration: boolean;
		trigger: boolean;
		inputs: {
			labelSize: CanvasNodeDefaultRenderLabelSize;
		};
		outputs: {
			labelSize: CanvasNodeDefaultRenderLabelSize;
		};
	}>;
};

export type CanvasNodeAddNodesRender = {
	type: CanvasNodeRenderType.AddNodes;
	options: Record<string, never>;
};

export type CanvasNodeStickyNoteRender = {
	type: CanvasNodeRenderType.StickyNote;
	options: Partial<{
		width: number;
		height: number;
		color: number;
		content: string;
	}>;
};

export interface CanvasNodeData {
	id: INodeUi['id'];
	name: INodeUi['name'];
	subtitle: string;
	type: INodeUi['type'];
	typeVersion: INodeUi['typeVersion'];
	disabled: INodeUi['disabled'];
	inputs: CanvasConnectionPort[];
	outputs: CanvasConnectionPort[];
	connections: {
		[CanvasConnectionMode.Input]: INodeConnections;
		[CanvasConnectionMode.Output]: INodeConnections;
	};
	issues: {
		items: string[];
		visible: boolean;
	};
	pinnedData: {
		count: number;
		visible: boolean;
	};
	execution: {
		status?: ExecutionStatus;
		waiting?: string;
		running: boolean;
	};
	runData: {
		count: number;
		visible: boolean;
	};
	render: CanvasNodeDefaultRender | CanvasNodeStickyNoteRender | CanvasNodeAddNodesRender;
}

export type CanvasNode = Node<CanvasNodeData>;

export interface CanvasConnectionData {
	source: CanvasConnectionPort;
	target: CanvasConnectionPort;
	fromNodeName?: string;
	status?: 'success' | 'error' | 'pinned' | 'running';
}

export type CanvasConnection = DefaultEdge<CanvasConnectionData>;

export type CanvasConnectionCreateData = {
	source: string;
	target: string;
	data: {
		source: PartialBy<IConnection, 'node'>;
		target: PartialBy<IConnection, 'node'>;
	};
};

export interface CanvasInjectionData {
	connectingHandle: Ref<ConnectStartEvent | undefined>;
}

export type CanvasNodeEventBusEvents = {
	'update:sticky:color': never;
	'update:node:active': never;
};

export type CanvasEventBusEvents = {
	fitView: never;
	'saved:workflow': never;
	'open:execution': IExecutionResponse;
	'nodes:select': { ids: string[] };
	'nodes:action': {
		ids: string[];
		action: keyof CanvasNodeEventBusEvents;
		payload?: CanvasNodeEventBusEvents[keyof CanvasNodeEventBusEvents];
	};
};

export interface CanvasNodeInjectionData {
	id: Ref<string>;
	data: Ref<CanvasNodeData>;
	label: Ref<NodeProps['label']>;
	selected: Ref<NodeProps['selected']>;
	eventBus: Ref<EventBus<CanvasNodeEventBusEvents>>;
}

export interface CanvasNodeHandleInjectionData {
	label: Ref<string | undefined>;
	mode: Ref<CanvasConnectionMode>;
	type: Ref<NodeConnectionType>;
	isConnected: Ref<boolean | undefined>;
	isConnecting: Ref<boolean | undefined>;
}

export type ConnectStartEvent = { handleId: string; handleType: string; nodeId: string };

export type CanvasNodeMoveEvent = { id: string; position: CanvasNode['position'] };
