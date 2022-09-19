//
//  DTXSymbolExtractorProto.h
//  DTXSymbolExtractor
//
//  Created by Lazar, Radu on 20.09.18.
//  Copyright © 2018 Dynatrace. All rights reserved.
//

#import <Foundation/Foundation.h>

@class DTXRuntimeOptions;
@class DTXSymbolUploadEntry;
@class DTXResults;

@protocol DTXSymbolExtractorProto <NSObject>

@property DTXRuntimeOptions* runtimeOptions;
@property NSMutableArray* extracts;
@property bool onlyMetadata;

@property (nonatomic, copy) DTXResults* (^fetchListForAppnameHTTPRequestBlock)(NSString *appName);
@property (nonatomic, copy) void (^didCompleteExtractionBlock)(DTXSymbolUploadEntry *extractEntry);

- (id)initWithRuntimeOptions:(DTXRuntimeOptions*)runtimeOptions;

- (bool)extractSymbols:(NSString**)errorStr rc:(NSInteger*)rc;
- (void)stopExtract;

@end
