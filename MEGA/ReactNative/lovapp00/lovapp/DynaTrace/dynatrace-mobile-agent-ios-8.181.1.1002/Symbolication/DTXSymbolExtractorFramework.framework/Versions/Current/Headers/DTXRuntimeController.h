//
//  DTXRuntimeController.h
//
// Copyright 2011-2016 Dynatrace LLC
//
//

#import <Foundation/Foundation.h>

@class DTXRuntimeOptions;
@class DTXResults;

@interface DTXRuntimeController : NSObject <NSURLSessionDelegate>

@property (nonatomic, strong) DTXRuntimeOptions* runtimeOptions;

- (id)initWithRuntimeOptions:(DTXRuntimeOptions*)runtimeOptions;
- (DTXResults*)execute;

+ (void)initializeDiagnostics;

@end
