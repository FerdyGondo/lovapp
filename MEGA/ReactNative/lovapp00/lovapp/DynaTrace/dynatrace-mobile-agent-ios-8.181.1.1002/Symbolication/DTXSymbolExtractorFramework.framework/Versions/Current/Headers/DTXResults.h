//
//  DTXResults.h
//
//  Copyright (c) 2015-2016 Dynatrace LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

@class DTXRuntimeOptions;
@class DTXSymbolUploadEntry;

@interface DTXResults : NSObject

@property (nonatomic, assign) BOOL                  success;
@property (nonatomic, assign) NSInteger             responseCode;
@property (nonatomic, strong) NSString*             error;
@property (nonatomic, strong) DTXRuntimeOptions*    runtimeOptions;
@property (nonatomic, strong) id                    details;

- (NSString*)formatResultsToString;

- (NSString*)formatDeleteCmdResultsToString:(NSArray*)jsonDictionaryArray indent:(int)indent error:(NSString* __autoreleasing*)error;
- (NSString*)formatInfoCmdResultsToString:(NSDictionary*)httpResponseHeaders indent:(int)indent error:(NSString* __autoreleasing*)error;
- (NSString*)formatStatusCmdResultsToString:(NSDictionary*)httpResponseHeaders indent:(int)indent error:(NSString* __autoreleasing*)error;
- (NSString*)formatListCmdResultsToString:(NSArray*)jsonDictionaryArray indent:(int)indent error:(NSString* __autoreleasing*)error;
- (NSString*)formatDecodeOnlyCmdResultsToString:(NSArray*)uploadQueue indent:(int)indent error:(NSString* __autoreleasing*)error;
- (NSString*)formatUploadCmdResultsToString:(NSArray<DTXSymbolUploadEntry*>*)uploadedExtracts indent:(int)indent error:(NSString* __autoreleasing*)error;
- (NSString*)formatVersionCmdResultsToString:(NSArray*)httpReceivedData indent:(int)indent error:(NSString* __autoreleasing*)error;

+ (NSDictionary*)getListCmdResultsToDictionary:(NSArray*)jsonDictionaryArray error:(NSString* __autoreleasing*)error;

@end
