// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'api_models.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SessionStatus {

 String get publicToken; String get state; String get patientName; int get patientAge; String get patientSex; String get language;
/// Create a copy of SessionStatus
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SessionStatusCopyWith<SessionStatus> get copyWith => _$SessionStatusCopyWithImpl<SessionStatus>(this as SessionStatus, _$identity);

  /// Serializes this SessionStatus to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SessionStatus;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SessionStatus&&(identical(other.publicToken, _this.publicToken) || other.publicToken == _this.publicToken)&&(identical(other.state, _this.state) || other.state == _this.state)&&(identical(other.patientName, _this.patientName) || other.patientName == _this.patientName)&&(identical(other.patientAge, _this.patientAge) || other.patientAge == _this.patientAge)&&(identical(other.patientSex, _this.patientSex) || other.patientSex == _this.patientSex)&&(identical(other.language, _this.language) || other.language == _this.language));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SessionStatus;
  return Object.hash(runtimeType,_this.publicToken,_this.state,_this.patientName,_this.patientAge,_this.patientSex,_this.language);
}

@override
String toString() {
  final _this = this as SessionStatus;
  return 'SessionStatus(publicToken: ${_this.publicToken}, state: ${_this.state}, patientName: ${_this.patientName}, patientAge: ${_this.patientAge}, patientSex: ${_this.patientSex}, language: ${_this.language})';
}


}

/// @nodoc
abstract mixin class $SessionStatusCopyWith<$Res>  {
  factory $SessionStatusCopyWith(SessionStatus value, $Res Function(SessionStatus) _then) = _$SessionStatusCopyWithImpl;
@useResult
$Res call({
 String publicToken, String state, String patientName, int patientAge, String patientSex, String language
});




}
/// @nodoc
class _$SessionStatusCopyWithImpl<$Res>
    implements $SessionStatusCopyWith<$Res> {
  _$SessionStatusCopyWithImpl(this._self, this._then);

  final SessionStatus _self;
  final $Res Function(SessionStatus) _then;

/// Create a copy of SessionStatus
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? publicToken = null,Object? state = null,Object? patientName = null,Object? patientAge = null,Object? patientSex = null,Object? language = null,}) {
  return _then(SessionStatus(
publicToken: null == publicToken ? _self.publicToken : publicToken // ignore: cast_nullable_to_non_nullable
as String,state: null == state ? _self.state : state // ignore: cast_nullable_to_non_nullable
as String,patientName: null == patientName ? _self.patientName : patientName // ignore: cast_nullable_to_non_nullable
as String,patientAge: null == patientAge ? _self.patientAge : patientAge // ignore: cast_nullable_to_non_nullable
as int,patientSex: null == patientSex ? _self.patientSex : patientSex // ignore: cast_nullable_to_non_nullable
as String,language: null == language ? _self.language : language // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [SessionStatus].
extension SessionStatusPatterns on SessionStatus {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SessionStatus value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SessionStatus() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SessionStatus value)  $default,){
final _that = this;
switch (_that) {
case _SessionStatus():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SessionStatus value)?  $default,){
final _that = this;
switch (_that) {
case _SessionStatus() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String publicToken,  String state,  String patientName,  int patientAge,  String patientSex,  String language)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SessionStatus() when $default != null:
return $default(_that.publicToken,_that.state,_that.patientName,_that.patientAge,_that.patientSex,_that.language);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String publicToken,  String state,  String patientName,  int patientAge,  String patientSex,  String language)  $default,) {final _that = this;
switch (_that) {
case _SessionStatus():
return $default(_that.publicToken,_that.state,_that.patientName,_that.patientAge,_that.patientSex,_that.language);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String publicToken,  String state,  String patientName,  int patientAge,  String patientSex,  String language)?  $default,) {final _that = this;
switch (_that) {
case _SessionStatus() when $default != null:
return $default(_that.publicToken,_that.state,_that.patientName,_that.patientAge,_that.patientSex,_that.language);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SessionStatus implements SessionStatus {
  const _SessionStatus({required this.publicToken, required this.state, required this.patientName, required this.patientAge, required this.patientSex, required this.language});
  factory _SessionStatus.fromJson(Map<String, dynamic> json) => _$SessionStatusFromJson(json);

@override final  String publicToken;
@override final  String state;
@override final  String patientName;
@override final  int patientAge;
@override final  String patientSex;
@override final  String language;

/// Create a copy of SessionStatus
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SessionStatusCopyWith<_SessionStatus> get copyWith => __$SessionStatusCopyWithImpl<_SessionStatus>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SessionStatusToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SessionStatus&&(identical(other.publicToken, publicToken) || other.publicToken == publicToken)&&(identical(other.state, state) || other.state == state)&&(identical(other.patientName, patientName) || other.patientName == patientName)&&(identical(other.patientAge, patientAge) || other.patientAge == patientAge)&&(identical(other.patientSex, patientSex) || other.patientSex == patientSex)&&(identical(other.language, language) || other.language == language));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,publicToken,state,patientName,patientAge,patientSex,language);
}

@override
String toString() {
    return 'SessionStatus(publicToken: $publicToken, state: $state, patientName: $patientName, patientAge: $patientAge, patientSex: $patientSex, language: $language)';
}


}

/// @nodoc
abstract mixin class _$SessionStatusCopyWith<$Res> implements $SessionStatusCopyWith<$Res> {
  factory _$SessionStatusCopyWith(_SessionStatus value, $Res Function(_SessionStatus) _then) = __$SessionStatusCopyWithImpl;
@override @useResult
$Res call({
 String publicToken, String state, String patientName, int patientAge, String patientSex, String language
});




}
/// @nodoc
class __$SessionStatusCopyWithImpl<$Res>
    implements _$SessionStatusCopyWith<$Res> {
  __$SessionStatusCopyWithImpl(this._self, this._then);

  final _SessionStatus _self;
  final $Res Function(_SessionStatus) _then;

/// Create a copy of SessionStatus
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? publicToken = null,Object? state = null,Object? patientName = null,Object? patientAge = null,Object? patientSex = null,Object? language = null,}) {
  return _then(_SessionStatus(
publicToken: null == publicToken ? _self.publicToken : publicToken // ignore: cast_nullable_to_non_nullable
as String,state: null == state ? _self.state : state // ignore: cast_nullable_to_non_nullable
as String,patientName: null == patientName ? _self.patientName : patientName // ignore: cast_nullable_to_non_nullable
as String,patientAge: null == patientAge ? _self.patientAge : patientAge // ignore: cast_nullable_to_non_nullable
as int,patientSex: null == patientSex ? _self.patientSex : patientSex // ignore: cast_nullable_to_non_nullable
as String,language: null == language ? _self.language : language // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$ConsentPayload {

 bool get agreed; List<String> get scope;
/// Create a copy of ConsentPayload
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ConsentPayloadCopyWith<ConsentPayload> get copyWith => _$ConsentPayloadCopyWithImpl<ConsentPayload>(this as ConsentPayload, _$identity);

  /// Serializes this ConsentPayload to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ConsentPayload;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ConsentPayload&&(identical(other.agreed, _this.agreed) || other.agreed == _this.agreed)&&const DeepCollectionEquality().equals(other.scope, _this.scope));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ConsentPayload;
  return Object.hash(runtimeType,_this.agreed,const DeepCollectionEquality().hash(_this.scope));
}

@override
String toString() {
  final _this = this as ConsentPayload;
  return 'ConsentPayload(agreed: ${_this.agreed}, scope: ${_this.scope})';
}


}

/// @nodoc
abstract mixin class $ConsentPayloadCopyWith<$Res>  {
  factory $ConsentPayloadCopyWith(ConsentPayload value, $Res Function(ConsentPayload) _then) = _$ConsentPayloadCopyWithImpl;
@useResult
$Res call({
 bool agreed, List<String> scope
});




}
/// @nodoc
class _$ConsentPayloadCopyWithImpl<$Res>
    implements $ConsentPayloadCopyWith<$Res> {
  _$ConsentPayloadCopyWithImpl(this._self, this._then);

  final ConsentPayload _self;
  final $Res Function(ConsentPayload) _then;

/// Create a copy of ConsentPayload
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? agreed = null,Object? scope = null,}) {
  return _then(ConsentPayload(
agreed: null == agreed ? _self.agreed : agreed // ignore: cast_nullable_to_non_nullable
as bool,scope: null == scope ? _self.scope : scope // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [ConsentPayload].
extension ConsentPayloadPatterns on ConsentPayload {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ConsentPayload value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ConsentPayload() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ConsentPayload value)  $default,){
final _that = this;
switch (_that) {
case _ConsentPayload():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ConsentPayload value)?  $default,){
final _that = this;
switch (_that) {
case _ConsentPayload() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool agreed,  List<String> scope)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ConsentPayload() when $default != null:
return $default(_that.agreed,_that.scope);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool agreed,  List<String> scope)  $default,) {final _that = this;
switch (_that) {
case _ConsentPayload():
return $default(_that.agreed,_that.scope);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool agreed,  List<String> scope)?  $default,) {final _that = this;
switch (_that) {
case _ConsentPayload() when $default != null:
return $default(_that.agreed,_that.scope);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ConsentPayload implements ConsentPayload {
  const _ConsentPayload({required this.agreed, required  List<String> scope}): _scope = scope;
  factory _ConsentPayload.fromJson(Map<String, dynamic> json) => _$ConsentPayloadFromJson(json);

@override final  bool agreed;
 final  List<String> _scope;
@override List<String> get scope {
  if (_scope is EqualUnmodifiableListView) return _scope;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_scope);
}


/// Create a copy of ConsentPayload
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ConsentPayloadCopyWith<_ConsentPayload> get copyWith => __$ConsentPayloadCopyWithImpl<_ConsentPayload>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ConsentPayloadToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ConsentPayload&&(identical(other.agreed, agreed) || other.agreed == agreed)&&const DeepCollectionEquality().equals(other.scope, _scope));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,agreed,const DeepCollectionEquality().hash(_scope));
}

@override
String toString() {
    return 'ConsentPayload(agreed: $agreed, scope: $scope)';
}


}

/// @nodoc
abstract mixin class _$ConsentPayloadCopyWith<$Res> implements $ConsentPayloadCopyWith<$Res> {
  factory _$ConsentPayloadCopyWith(_ConsentPayload value, $Res Function(_ConsentPayload) _then) = __$ConsentPayloadCopyWithImpl;
@override @useResult
$Res call({
 bool agreed, List<String> scope
});




}
/// @nodoc
class __$ConsentPayloadCopyWithImpl<$Res>
    implements _$ConsentPayloadCopyWith<$Res> {
  __$ConsentPayloadCopyWithImpl(this._self, this._then);

  final _ConsentPayload _self;
  final $Res Function(_ConsentPayload) _then;

/// Create a copy of ConsentPayload
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? agreed = null,Object? scope = null,}) {
  return _then(_ConsentPayload(
agreed: null == agreed ? _self.agreed : agreed // ignore: cast_nullable_to_non_nullable
as bool,scope: null == scope ? _self._scope : scope // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}


/// @nodoc
mixin _$NextQuestionResponse {

 bool get isComplete; String? get questionId; String? get text; String? get targetSlot;
/// Create a copy of NextQuestionResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$NextQuestionResponseCopyWith<NextQuestionResponse> get copyWith => _$NextQuestionResponseCopyWithImpl<NextQuestionResponse>(this as NextQuestionResponse, _$identity);

  /// Serializes this NextQuestionResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as NextQuestionResponse;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is NextQuestionResponse&&(identical(other.isComplete, _this.isComplete) || other.isComplete == _this.isComplete)&&(identical(other.questionId, _this.questionId) || other.questionId == _this.questionId)&&(identical(other.text, _this.text) || other.text == _this.text)&&(identical(other.targetSlot, _this.targetSlot) || other.targetSlot == _this.targetSlot));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as NextQuestionResponse;
  return Object.hash(runtimeType,_this.isComplete,_this.questionId,_this.text,_this.targetSlot);
}

@override
String toString() {
  final _this = this as NextQuestionResponse;
  return 'NextQuestionResponse(isComplete: ${_this.isComplete}, questionId: ${_this.questionId}, text: ${_this.text}, targetSlot: ${_this.targetSlot})';
}


}

/// @nodoc
abstract mixin class $NextQuestionResponseCopyWith<$Res>  {
  factory $NextQuestionResponseCopyWith(NextQuestionResponse value, $Res Function(NextQuestionResponse) _then) = _$NextQuestionResponseCopyWithImpl;
@useResult
$Res call({
 bool isComplete, String? questionId, String? text, String? targetSlot
});




}
/// @nodoc
class _$NextQuestionResponseCopyWithImpl<$Res>
    implements $NextQuestionResponseCopyWith<$Res> {
  _$NextQuestionResponseCopyWithImpl(this._self, this._then);

  final NextQuestionResponse _self;
  final $Res Function(NextQuestionResponse) _then;

/// Create a copy of NextQuestionResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isComplete = null,Object? questionId = freezed,Object? text = freezed,Object? targetSlot = freezed,}) {
  return _then(NextQuestionResponse(
isComplete: null == isComplete ? _self.isComplete : isComplete // ignore: cast_nullable_to_non_nullable
as bool,questionId: freezed == questionId ? _self.questionId : questionId // ignore: cast_nullable_to_non_nullable
as String?,text: freezed == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String?,targetSlot: freezed == targetSlot ? _self.targetSlot : targetSlot // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [NextQuestionResponse].
extension NextQuestionResponsePatterns on NextQuestionResponse {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _NextQuestionResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _NextQuestionResponse() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _NextQuestionResponse value)  $default,){
final _that = this;
switch (_that) {
case _NextQuestionResponse():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _NextQuestionResponse value)?  $default,){
final _that = this;
switch (_that) {
case _NextQuestionResponse() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool isComplete,  String? questionId,  String? text,  String? targetSlot)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _NextQuestionResponse() when $default != null:
return $default(_that.isComplete,_that.questionId,_that.text,_that.targetSlot);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool isComplete,  String? questionId,  String? text,  String? targetSlot)  $default,) {final _that = this;
switch (_that) {
case _NextQuestionResponse():
return $default(_that.isComplete,_that.questionId,_that.text,_that.targetSlot);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool isComplete,  String? questionId,  String? text,  String? targetSlot)?  $default,) {final _that = this;
switch (_that) {
case _NextQuestionResponse() when $default != null:
return $default(_that.isComplete,_that.questionId,_that.text,_that.targetSlot);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _NextQuestionResponse implements NextQuestionResponse {
  const _NextQuestionResponse({required this.isComplete, this.questionId, this.text, this.targetSlot});
  factory _NextQuestionResponse.fromJson(Map<String, dynamic> json) => _$NextQuestionResponseFromJson(json);

@override final  bool isComplete;
@override final  String? questionId;
@override final  String? text;
@override final  String? targetSlot;

/// Create a copy of NextQuestionResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$NextQuestionResponseCopyWith<_NextQuestionResponse> get copyWith => __$NextQuestionResponseCopyWithImpl<_NextQuestionResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$NextQuestionResponseToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _NextQuestionResponse&&(identical(other.isComplete, isComplete) || other.isComplete == isComplete)&&(identical(other.questionId, questionId) || other.questionId == questionId)&&(identical(other.text, text) || other.text == text)&&(identical(other.targetSlot, targetSlot) || other.targetSlot == targetSlot));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,isComplete,questionId,text,targetSlot);
}

@override
String toString() {
    return 'NextQuestionResponse(isComplete: $isComplete, questionId: $questionId, text: $text, targetSlot: $targetSlot)';
}


}

/// @nodoc
abstract mixin class _$NextQuestionResponseCopyWith<$Res> implements $NextQuestionResponseCopyWith<$Res> {
  factory _$NextQuestionResponseCopyWith(_NextQuestionResponse value, $Res Function(_NextQuestionResponse) _then) = __$NextQuestionResponseCopyWithImpl;
@override @useResult
$Res call({
 bool isComplete, String? questionId, String? text, String? targetSlot
});




}
/// @nodoc
class __$NextQuestionResponseCopyWithImpl<$Res>
    implements _$NextQuestionResponseCopyWith<$Res> {
  __$NextQuestionResponseCopyWithImpl(this._self, this._then);

  final _NextQuestionResponse _self;
  final $Res Function(_NextQuestionResponse) _then;

/// Create a copy of NextQuestionResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isComplete = null,Object? questionId = freezed,Object? text = freezed,Object? targetSlot = freezed,}) {
  return _then(_NextQuestionResponse(
isComplete: null == isComplete ? _self.isComplete : isComplete // ignore: cast_nullable_to_non_nullable
as bool,questionId: freezed == questionId ? _self.questionId : questionId // ignore: cast_nullable_to_non_nullable
as String?,text: freezed == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String?,targetSlot: freezed == targetSlot ? _self.targetSlot : targetSlot // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}


/// @nodoc
mixin _$AnswerPayload {

 String get questionId; String get targetSlot; String get rawText; String? get evidenceId;
/// Create a copy of AnswerPayload
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AnswerPayloadCopyWith<AnswerPayload> get copyWith => _$AnswerPayloadCopyWithImpl<AnswerPayload>(this as AnswerPayload, _$identity);

  /// Serializes this AnswerPayload to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AnswerPayload;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AnswerPayload&&(identical(other.questionId, _this.questionId) || other.questionId == _this.questionId)&&(identical(other.targetSlot, _this.targetSlot) || other.targetSlot == _this.targetSlot)&&(identical(other.rawText, _this.rawText) || other.rawText == _this.rawText)&&(identical(other.evidenceId, _this.evidenceId) || other.evidenceId == _this.evidenceId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AnswerPayload;
  return Object.hash(runtimeType,_this.questionId,_this.targetSlot,_this.rawText,_this.evidenceId);
}

@override
String toString() {
  final _this = this as AnswerPayload;
  return 'AnswerPayload(questionId: ${_this.questionId}, targetSlot: ${_this.targetSlot}, rawText: ${_this.rawText}, evidenceId: ${_this.evidenceId})';
}


}

/// @nodoc
abstract mixin class $AnswerPayloadCopyWith<$Res>  {
  factory $AnswerPayloadCopyWith(AnswerPayload value, $Res Function(AnswerPayload) _then) = _$AnswerPayloadCopyWithImpl;
@useResult
$Res call({
 String questionId, String targetSlot, String rawText, String? evidenceId
});




}
/// @nodoc
class _$AnswerPayloadCopyWithImpl<$Res>
    implements $AnswerPayloadCopyWith<$Res> {
  _$AnswerPayloadCopyWithImpl(this._self, this._then);

  final AnswerPayload _self;
  final $Res Function(AnswerPayload) _then;

/// Create a copy of AnswerPayload
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? questionId = null,Object? targetSlot = null,Object? rawText = null,Object? evidenceId = freezed,}) {
  return _then(AnswerPayload(
questionId: null == questionId ? _self.questionId : questionId // ignore: cast_nullable_to_non_nullable
as String,targetSlot: null == targetSlot ? _self.targetSlot : targetSlot // ignore: cast_nullable_to_non_nullable
as String,rawText: null == rawText ? _self.rawText : rawText // ignore: cast_nullable_to_non_nullable
as String,evidenceId: freezed == evidenceId ? _self.evidenceId : evidenceId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [AnswerPayload].
extension AnswerPayloadPatterns on AnswerPayload {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AnswerPayload value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AnswerPayload() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AnswerPayload value)  $default,){
final _that = this;
switch (_that) {
case _AnswerPayload():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AnswerPayload value)?  $default,){
final _that = this;
switch (_that) {
case _AnswerPayload() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String questionId,  String targetSlot,  String rawText,  String? evidenceId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AnswerPayload() when $default != null:
return $default(_that.questionId,_that.targetSlot,_that.rawText,_that.evidenceId);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String questionId,  String targetSlot,  String rawText,  String? evidenceId)  $default,) {final _that = this;
switch (_that) {
case _AnswerPayload():
return $default(_that.questionId,_that.targetSlot,_that.rawText,_that.evidenceId);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String questionId,  String targetSlot,  String rawText,  String? evidenceId)?  $default,) {final _that = this;
switch (_that) {
case _AnswerPayload() when $default != null:
return $default(_that.questionId,_that.targetSlot,_that.rawText,_that.evidenceId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AnswerPayload implements AnswerPayload {
  const _AnswerPayload({required this.questionId, required this.targetSlot, required this.rawText, this.evidenceId});
  factory _AnswerPayload.fromJson(Map<String, dynamic> json) => _$AnswerPayloadFromJson(json);

@override final  String questionId;
@override final  String targetSlot;
@override final  String rawText;
@override final  String? evidenceId;

/// Create a copy of AnswerPayload
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AnswerPayloadCopyWith<_AnswerPayload> get copyWith => __$AnswerPayloadCopyWithImpl<_AnswerPayload>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AnswerPayloadToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AnswerPayload&&(identical(other.questionId, questionId) || other.questionId == questionId)&&(identical(other.targetSlot, targetSlot) || other.targetSlot == targetSlot)&&(identical(other.rawText, rawText) || other.rawText == rawText)&&(identical(other.evidenceId, evidenceId) || other.evidenceId == evidenceId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,questionId,targetSlot,rawText,evidenceId);
}

@override
String toString() {
    return 'AnswerPayload(questionId: $questionId, targetSlot: $targetSlot, rawText: $rawText, evidenceId: $evidenceId)';
}


}

/// @nodoc
abstract mixin class _$AnswerPayloadCopyWith<$Res> implements $AnswerPayloadCopyWith<$Res> {
  factory _$AnswerPayloadCopyWith(_AnswerPayload value, $Res Function(_AnswerPayload) _then) = __$AnswerPayloadCopyWithImpl;
@override @useResult
$Res call({
 String questionId, String targetSlot, String rawText, String? evidenceId
});




}
/// @nodoc
class __$AnswerPayloadCopyWithImpl<$Res>
    implements _$AnswerPayloadCopyWith<$Res> {
  __$AnswerPayloadCopyWithImpl(this._self, this._then);

  final _AnswerPayload _self;
  final $Res Function(_AnswerPayload) _then;

/// Create a copy of AnswerPayload
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? questionId = null,Object? targetSlot = null,Object? rawText = null,Object? evidenceId = freezed,}) {
  return _then(_AnswerPayload(
questionId: null == questionId ? _self.questionId : questionId // ignore: cast_nullable_to_non_nullable
as String,targetSlot: null == targetSlot ? _self.targetSlot : targetSlot // ignore: cast_nullable_to_non_nullable
as String,rawText: null == rawText ? _self.rawText : rawText // ignore: cast_nullable_to_non_nullable
as String,evidenceId: freezed == evidenceId ? _self.evidenceId : evidenceId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}


/// @nodoc
mixin _$ExtractedFact {

 String get slot; dynamic get value; String get status;
/// Create a copy of ExtractedFact
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ExtractedFactCopyWith<ExtractedFact> get copyWith => _$ExtractedFactCopyWithImpl<ExtractedFact>(this as ExtractedFact, _$identity);

  /// Serializes this ExtractedFact to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ExtractedFact;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ExtractedFact&&(identical(other.slot, _this.slot) || other.slot == _this.slot)&&const DeepCollectionEquality().equals(other.value, _this.value)&&(identical(other.status, _this.status) || other.status == _this.status));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ExtractedFact;
  return Object.hash(runtimeType,_this.slot,const DeepCollectionEquality().hash(_this.value),_this.status);
}

@override
String toString() {
  final _this = this as ExtractedFact;
  return 'ExtractedFact(slot: ${_this.slot}, value: ${_this.value}, status: ${_this.status})';
}


}

/// @nodoc
abstract mixin class $ExtractedFactCopyWith<$Res>  {
  factory $ExtractedFactCopyWith(ExtractedFact value, $Res Function(ExtractedFact) _then) = _$ExtractedFactCopyWithImpl;
@useResult
$Res call({
 String slot, dynamic value, String status
});




}
/// @nodoc
class _$ExtractedFactCopyWithImpl<$Res>
    implements $ExtractedFactCopyWith<$Res> {
  _$ExtractedFactCopyWithImpl(this._self, this._then);

  final ExtractedFact _self;
  final $Res Function(ExtractedFact) _then;

/// Create a copy of ExtractedFact
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? slot = null,Object? value = freezed,Object? status = null,}) {
  return _then(ExtractedFact(
slot: null == slot ? _self.slot : slot // ignore: cast_nullable_to_non_nullable
as String,value: freezed == value ? _self.value : value // ignore: cast_nullable_to_non_nullable
as dynamic,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ExtractedFact].
extension ExtractedFactPatterns on ExtractedFact {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ExtractedFact value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ExtractedFact() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ExtractedFact value)  $default,){
final _that = this;
switch (_that) {
case _ExtractedFact():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ExtractedFact value)?  $default,){
final _that = this;
switch (_that) {
case _ExtractedFact() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String slot,  dynamic value,  String status)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ExtractedFact() when $default != null:
return $default(_that.slot,_that.value,_that.status);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String slot,  dynamic value,  String status)  $default,) {final _that = this;
switch (_that) {
case _ExtractedFact():
return $default(_that.slot,_that.value,_that.status);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String slot,  dynamic value,  String status)?  $default,) {final _that = this;
switch (_that) {
case _ExtractedFact() when $default != null:
return $default(_that.slot,_that.value,_that.status);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ExtractedFact implements ExtractedFact {
  const _ExtractedFact({required this.slot, required this.value, required this.status});
  factory _ExtractedFact.fromJson(Map<String, dynamic> json) => _$ExtractedFactFromJson(json);

@override final  String slot;
@override final  dynamic value;
@override final  String status;

/// Create a copy of ExtractedFact
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ExtractedFactCopyWith<_ExtractedFact> get copyWith => __$ExtractedFactCopyWithImpl<_ExtractedFact>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ExtractedFactToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ExtractedFact&&(identical(other.slot, slot) || other.slot == slot)&&const DeepCollectionEquality().equals(other.value, value)&&(identical(other.status, status) || other.status == status));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,slot,const DeepCollectionEquality().hash(value),status);
}

@override
String toString() {
    return 'ExtractedFact(slot: $slot, value: $value, status: $status)';
}


}

/// @nodoc
abstract mixin class _$ExtractedFactCopyWith<$Res> implements $ExtractedFactCopyWith<$Res> {
  factory _$ExtractedFactCopyWith(_ExtractedFact value, $Res Function(_ExtractedFact) _then) = __$ExtractedFactCopyWithImpl;
@override @useResult
$Res call({
 String slot, dynamic value, String status
});




}
/// @nodoc
class __$ExtractedFactCopyWithImpl<$Res>
    implements _$ExtractedFactCopyWith<$Res> {
  __$ExtractedFactCopyWithImpl(this._self, this._then);

  final _ExtractedFact _self;
  final $Res Function(_ExtractedFact) _then;

/// Create a copy of ExtractedFact
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? slot = null,Object? value = freezed,Object? status = null,}) {
  return _then(_ExtractedFact(
slot: null == slot ? _self.slot : slot // ignore: cast_nullable_to_non_nullable
as String,value: freezed == value ? _self.value : value // ignore: cast_nullable_to_non_nullable
as dynamic,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$ReviewSummary {

 List<ExtractedFact> get facts;
/// Create a copy of ReviewSummary
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReviewSummaryCopyWith<ReviewSummary> get copyWith => _$ReviewSummaryCopyWithImpl<ReviewSummary>(this as ReviewSummary, _$identity);

  /// Serializes this ReviewSummary to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ReviewSummary;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReviewSummary&&const DeepCollectionEquality().equals(other.facts, _this.facts));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ReviewSummary;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.facts));
}

@override
String toString() {
  final _this = this as ReviewSummary;
  return 'ReviewSummary(facts: ${_this.facts})';
}


}

/// @nodoc
abstract mixin class $ReviewSummaryCopyWith<$Res>  {
  factory $ReviewSummaryCopyWith(ReviewSummary value, $Res Function(ReviewSummary) _then) = _$ReviewSummaryCopyWithImpl;
@useResult
$Res call({
 List<ExtractedFact> facts
});




}
/// @nodoc
class _$ReviewSummaryCopyWithImpl<$Res>
    implements $ReviewSummaryCopyWith<$Res> {
  _$ReviewSummaryCopyWithImpl(this._self, this._then);

  final ReviewSummary _self;
  final $Res Function(ReviewSummary) _then;

/// Create a copy of ReviewSummary
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? facts = null,}) {
  return _then(ReviewSummary(
facts: null == facts ? _self.facts : facts // ignore: cast_nullable_to_non_nullable
as List<ExtractedFact>,
  ));
}

}


/// Adds pattern-matching-related methods to [ReviewSummary].
extension ReviewSummaryPatterns on ReviewSummary {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReviewSummary value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReviewSummary() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReviewSummary value)  $default,){
final _that = this;
switch (_that) {
case _ReviewSummary():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReviewSummary value)?  $default,){
final _that = this;
switch (_that) {
case _ReviewSummary() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<ExtractedFact> facts)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReviewSummary() when $default != null:
return $default(_that.facts);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<ExtractedFact> facts)  $default,) {final _that = this;
switch (_that) {
case _ReviewSummary():
return $default(_that.facts);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<ExtractedFact> facts)?  $default,) {final _that = this;
switch (_that) {
case _ReviewSummary() when $default != null:
return $default(_that.facts);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReviewSummary implements ReviewSummary {
  const _ReviewSummary({required  List<ExtractedFact> facts}): _facts = facts;
  factory _ReviewSummary.fromJson(Map<String, dynamic> json) => _$ReviewSummaryFromJson(json);

 final  List<ExtractedFact> _facts;
@override List<ExtractedFact> get facts {
  if (_facts is EqualUnmodifiableListView) return _facts;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_facts);
}


/// Create a copy of ReviewSummary
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReviewSummaryCopyWith<_ReviewSummary> get copyWith => __$ReviewSummaryCopyWithImpl<_ReviewSummary>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReviewSummaryToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReviewSummary&&const DeepCollectionEquality().equals(other.facts, _facts));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_facts));
}

@override
String toString() {
    return 'ReviewSummary(facts: $facts)';
}


}

/// @nodoc
abstract mixin class _$ReviewSummaryCopyWith<$Res> implements $ReviewSummaryCopyWith<$Res> {
  factory _$ReviewSummaryCopyWith(_ReviewSummary value, $Res Function(_ReviewSummary) _then) = __$ReviewSummaryCopyWithImpl;
@override @useResult
$Res call({
 List<ExtractedFact> facts
});




}
/// @nodoc
class __$ReviewSummaryCopyWithImpl<$Res>
    implements _$ReviewSummaryCopyWith<$Res> {
  __$ReviewSummaryCopyWithImpl(this._self, this._then);

  final _ReviewSummary _self;
  final $Res Function(_ReviewSummary) _then;

/// Create a copy of ReviewSummary
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? facts = null,}) {
  return _then(_ReviewSummary(
facts: null == facts ? _self._facts : facts // ignore: cast_nullable_to_non_nullable
as List<ExtractedFact>,
  ));
}


}

// dart format on
