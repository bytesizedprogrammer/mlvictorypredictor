/// <reference types="node" />
import type { EventCallbackFunc, EventPayloadTypes, GameEndType, MetadataType, PostFrameUpdateType } from "../types";
import { Command } from "../types";
export declare enum SlpInputSource {
    BUFFER = "buffer",
    FILE = "file"
}
declare type SlpFileReadInput = {
    source: SlpInputSource.FILE;
    filePath: string;
};
declare type SlpBufferReadInput = {
    source: SlpInputSource.BUFFER;
    buffer: Buffer;
};
export declare type SlpReadInput = SlpFileReadInput | SlpBufferReadInput;
export declare type SlpRefType = SlpFileSourceRef | SlpBufferSourceRef;
export declare type SlpFileType = {
    ref: SlpRefType;
    rawDataPosition: number;
    rawDataLength: number;
    metadataPosition: number;
    metadataLength: number;
    messageSizes: {
        [command: number]: number;
    };
};
export declare type SlpFileSourceRef = {
    source: SlpInputSource.FILE;
    fileDescriptor: number;
};
export declare type SlpBufferSourceRef = {
    source: SlpInputSource.BUFFER;
    buffer: Buffer;
};
/**
 * Opens a file at path
 */
export declare function openSlpFile(input: SlpReadInput): SlpFileType;
export declare function closeSlpFile(file: SlpFileType): void;
/**
 * Iterates through slp events and parses payloads
 */
export declare function iterateEvents(slpFile: SlpFileType, callback: EventCallbackFunc, startPos?: number | null): number;
export declare function parseMessage(command: Command, payload: Uint8Array): EventPayloadTypes | null;
export declare function getMetadata(slpFile: SlpFileType): MetadataType | null;
export declare function getGameEnd(slpFile: SlpFileType): GameEndType | null;
export declare function extractFinalPostFrameUpdates(slpFile: SlpFileType): PostFrameUpdateType[];
export {};
//# sourceMappingURL=slpReader.d.ts.map