//
//  DTXSymbolExtractor.h
//
// Copyright 2011-2016 Dynatrace LLC
//
//
#pragma once
#import <Foundation/Foundation.h>
#import "DTXSymbolExtractorProto.h"

@interface DTXSymbolExtractor : NSObject <DTXSymbolExtractorProto> {
    @protected
    NSMutableDictionary* m_archivePListProps;
}

@end
